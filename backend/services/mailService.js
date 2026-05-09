const nodemailer = require("nodemailer");

const createTransporter = () => {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587);
  const secure =
    (process.env.SMTP_SECURE || process.env.EMAIL_SECURE) === "true";
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass =
    process.env.SMTP_PASS ||
    process.env.EMAIL_PASS ||
    process.env.EMAIL_PASSWORD;

  if (host) {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
  });
};

const EMAIL_DELIVERY_DISABLED = process.env.EMAIL_DELIVERY_DISABLED !== "false";

const sendMail = async ({ to, subject, text, html }) => {
  if (EMAIL_DELIVERY_DISABLED) {
    return {
      skipped: true,
      to,
      subject,
      text,
      html,
    };
  }

  const transporter = createTransporter();
  const from = process.env.EMAIL_FROM || "Gym System <no-reply@gymsystem.com>";

  return transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });
};

const sendOtpEmail = async ({ to, otp, expiresInMinutes = 10 }) => {
  const subject = "Your Gym System Verification OTP";
  const text = [
    "Hello,",
    "",
    `Your OTP code is: ${otp}`,
    `This code will expire in ${expiresInMinutes} minutes.`,
    "",
    "If you did not request this code, please ignore this email.",
  ].join("\n");

  const html = `
    <p>Hello,</p>
    <p>Your OTP code is: <strong>${otp}</strong></p>
    <p>This code will expire in ${expiresInMinutes} minutes.</p>
    <p>If you did not request this code, please ignore this email.</p>
  `;

  return sendMail({ to, subject, text, html });
};

module.exports = {
  sendMail,
  sendOtpEmail,
};
