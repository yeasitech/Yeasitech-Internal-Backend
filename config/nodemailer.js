// import nodemailer from "nodemailer";
const dotenv = require("dotenv").config();
// const transporter = nodemailer.createTransport({
//   host: "",
//   port: 587,
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: config.HOST_EMAIL, // generated ethereal user
//     pass: config.HOST_EMAIL_PASSWORD, // generated ethereal password
//   },
// });

// export default transporter;

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  auth: { user: process.env.HOST_EMAIL, pass: process.env.HOST_PASSWORD },
});
module.exports = transporter;
