import nodemailer from "nodemailer";
const config = require("./config");

const transporter = nodemailer.createTransport({
  host: "",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.HOST_EMAIL, // generated ethereal user
    pass: config.HOST_EMAIL_PASSWORD, // generated ethereal password
  },
});

export default transporter;
