require("dotenv").config();
//const nodeCron = require("node-cron");

const {
  userRouter,
  departmentRouter,
  holidayRouter,
  leaveRouter,
  salaryRouter,
  assetRouter,
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
app.use("/asset", assetRouter);

// const birthday = nodeCron.schedule(
//   " 5 0 * * *",
//   async function jobYouNeedToExecute(request, response) {
//     // Do whatever you want in here. Send email, Make  database backup or download data.
//     const todayDate = new Date().getDate();
//     const thisMonth = new Date().getMonth();
//     const data = await EmployeeDetails.findAll({ attributes: ["dateOfBirth"] });
//     for (let i = 0; i < data.length; i++) {
//       let databaseDate = data[i].dataValues.dateOfBirth;
//       let date = new Date(databaseDate).getDate();
//       let month = new Date(databaseDate).getMonth();
//       if (todayDate == date && thisMonth == month) {
//         console.log(`happy birthday man enjoy your day`);
//       } else {
//         console.log(`sorry `);
//       }
//     }

//     //console.log(data[0].dataValues.dateOfBirth);
//     let date = new Date();
//     console.log(date.toLocaleString());
//     //console.log(new Date(dataBaseDate).getMonth());
//   }
//);

// birthday.start();

app.listen(port, () => {
  console.log(`server is listening to the port :${port}`);
});
