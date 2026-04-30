const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: 'Gym System 🏋️‍♂️ <no-reply@gym.com>', 
    to: options.email, 
    subject: options.subject, 
    text: options.message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(" Gym Email Error: ", error.message);
    } else {
      console.log(" Gym Email Sent: " + info.response);
    }
  });
};

module.exports = sendEmail;