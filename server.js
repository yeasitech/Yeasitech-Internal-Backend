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
const { User, EmployeeDetails } = require("./models/index");
var corsOptions = { origin: "*" };
app.use(cors(corsOptions));

app.use(express.json());

app.use("/user", userRouter);
app.use("/salary", salaryRouter);
app.use("/public", departmentRouter);
app.use("/holiday", holidayRouter);
app.use("/leave", leaveRouter);
// const birthday = nodeCron.schedule(
//   "1 * * * * *",
//   async function jobYouNeedToExecute(request, response) {
//     // Do whatever you want in here. Send email, Make  database backup or download data.

//     const data = await EmployeeDetails.findAll({ attributes: ["dateOfBirth"] });
//     console.log(data);
//   }
// );
// birthday.start();
app.listen(port, () => {
  console.log(`server is listening to the port :${port}`);
});
