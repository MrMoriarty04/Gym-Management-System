const { sendMail } = require("../services/mailService");

const sendEmail = async (options) => {
  return sendMail({
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  });
};

module.exports = sendEmail;
