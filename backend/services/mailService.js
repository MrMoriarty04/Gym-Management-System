const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendMail = async ({ to, subject, text, html }) => {
  const transporter = createTransporter();
  const from = process.env.EMAIL_FROM || 'Gym System <no-reply@gymsystem.com>';

  return transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });
};

const sendOtpEmail = async ({ to, otp, expiresInMinutes = 10 }) => {
  const subject = 'Your Gym System Verification OTP';
  const text = [
    'Hello,',
    '',
    `Your OTP code is: ${otp}`,
    `This code will expire in ${expiresInMinutes} minutes.`,
    '',
    'If you did not request this code, please ignore this email.',
  ].join('\n');

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
