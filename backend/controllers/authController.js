const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { sendOtpEmail } = require("../services/mailService");

const OTP_EXPIRY_MINUTES = 10;

const generateOtpCode = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

const createJwt = (user) => {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );
};

const requestOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({
      email: String(email).toLowerCase().trim(),
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOtpCode();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    await user.save();

    await sendOtpEmail({
      to: user.email,
      otp,
      expiresInMinutes: OTP_EXPIRY_MINUTES,
    });

    return res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("requestOtp error:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({
      email: String(email).toLowerCase().trim(),
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp || !user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "OTP is invalid or expired" });
    }

    if (String(user.otp).trim() !== String(otp).trim()) {
      return res.status(400).json({ message: "OTP is invalid or expired" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const authToken = createJwt(user);

    res.cookie("jwt", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "OTP verified successfully",
      token: authToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("verifyOtp error:", error);
    return res.status(500).json({ message: "Failed to verify OTP" });
  }
};

module.exports = {
  requestOtp,
  verifyOtp,
};
