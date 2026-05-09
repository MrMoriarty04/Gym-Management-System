const jwt = require("jsonwebtoken");

const User = require("../models/User");
const OtpToken = require("../models/OtpToken");

const OTP_EXPIRY_MINUTES = 10;
const TEST_OTP = process.env.TEST_OTP || "123456";

const generateOtpCode = () => {
  return TEST_OTP;
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
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({
      email: String(email).toLowerCase().trim(),
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    await OtpToken.deleteMany({ userId: user._id, purpose: "verify-account" });

    const otp = generateOtpCode();
    await OtpToken.create({
      userId: user._id,
      otp: otp,
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
      purpose: "verify-account",
    });

    return res.status(200).json({
      message: "OTP generated successfully",
      testOtp: otp,
    });
  } catch (error) {
    console.error("requestOtp error:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP are required" });

    const user = await User.findOne({
      email: String(email).toLowerCase().trim(),
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otpRecord = await OtpToken.findOne({
      userId: user._id,
      otp: String(otp).trim(),
      purpose: "verify-account",
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP is invalid or expired" });
    }

    user.isVerified = true;
    await user.save();

    await OtpToken.findByIdAndDelete(otpRecord._id);

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
        id: user._id.toString(),
        name: user.name,
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
