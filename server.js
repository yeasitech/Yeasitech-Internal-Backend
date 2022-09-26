require("dotenv").config();
const nodeCron = require("node-cron");

const {
  userRouter,
  departmentRouter,
  holidayRouter,
  leaveRouter,
  salaryRouter,
  assetRouter,
  candidateRouter,
  commentRouter,
} = require("./routes/user.router");
const express = require("express");
const app = express();
const cors = require("cors");
const transporter = require("./config/nodemailer");
const port = process.env.PORT || 5000;
const { User, EmployeeDetails, CandidateModel } = require("./models/index");
const { request } = require("express");

var corsOptions = { origin: "*" };
app.use(cors(corsOptions));

app.use(express.json());

app.use("/user", userRouter);
app.use("/salary", salaryRouter);
app.use("/public", departmentRouter);
app.use("/holiday", holidayRouter);
app.use("/leave", leaveRouter);
app.use("/asset", assetRouter);
app.use("/candidate", candidateRouter);
app.use("/comment", commentRouter);

//

//interviewSchedule.start();

app.listen(port, () => {
  console.log(`server is listening to the port :${port}`);
});
