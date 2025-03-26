const nodemailer = require("nodemailer");
const logger = require("./logger");
const { EMAIL_USER, EMAIL_PASS, SMTP_HOST } = process.env;

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: 465,
  secure: true, // Gunakan 'true' jika port 465, 'false' jika port lain
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify transporter connection
transporter.verify(function (error, success) {
  if (error) {
    logger.error(`Error verifying transporter: ${EMAIL_USER}, ${EMAIL_PASS}`, error);
    console.error("Error verifying transporter:", error);
  } else {
    logger.info("Server is ready to take our messages");
    console.log("Server is ready to take our messages");
  }
});

module.exports = transporter;
