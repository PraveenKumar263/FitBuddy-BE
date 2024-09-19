const nodemailer = require("nodemailer");
const { EMAIL_ID, EMAIL_PWD, SMTP_EMAIL_HOST } = require("./config");

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: SMTP_EMAIL_HOST,
  auth: {
    user: EMAIL_ID,
    pass: EMAIL_PWD,
  },
});

// To send email
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: EMAIL_ID,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    throw new Error("Error sending email, please try again later");
  }
};

module.exports = sendEmail;
