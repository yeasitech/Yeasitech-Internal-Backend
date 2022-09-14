require("dotenv").config();
const nodeCron = require("node-cron");
const {
  userRouter,
  departmentRouter,
  holidayRouter,
  leaveRouter,
  salaryRouter,
} = require("./routes/user.router");
const express = require("express");
const app = express();
const cors = require("cors");
const transporter = require("./config/nodemailer");
const port = process.env.PORT || 5000;
const models = require("./models/index");
var corsOptions = { origin: "*" };
app.use(cors(corsOptions));

app.use(express.json());

app.use("/user", userRouter);
app.use("/salary", salaryRouter);
app.use("/public", departmentRouter);
app.use("/holiday", holidayRouter);
app.use("/leave", leaveRouter);
const job = nodeCron.schedule("* 1 * * * *", function jobYouNeedToExecute() {
  // Do whatever you want in here. Send email, Make  database backup or download data.
  var mailOptions = {
    from: process.env.HOST_EMAIL,
    to: "sudip@yeasitech.com, ramjan@yeasitech.com",
    subject: "Sending Email using Node.js",
    text: "That was easy!",
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(`123456`, error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  console.log(new Date().toLocaleString());
  console.log(mailOptions);
});
job.start();
app.listen(port, () => {
  console.log(`server is listening to the port :${port}`);
});
