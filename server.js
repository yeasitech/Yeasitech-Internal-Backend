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
  expenseRouter,
  userLoginRouter,
} = require("./routes/user.router");
const express = require("express");
const app = express();
const cors = require("cors");
const transporter = require("./config/nodemailer");
const port = process.env.PORT || 5000;
const { User, EmployeeDetails, CandidateModel } = require("./models/index");

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
app.use("/expense", expenseRouter);
app.use("/userLogin", userLoginRouter);

// const birthday = nodeCron.schedule(
//   " 5 0 * * *  ",
//   async function jobYouNeedToExecute(request, response) {
//     // Do whatever you want in here. Send email, Make  database backup or download data.
//     const todayDate = new Date().getDate();
//     const thisMonth = new Date().getMonth();
//     const data = await User.findAll({
//       attributes: ["firstName", "middleName", "lastName", "id"],
//       include: { model: EmployeeDetails, attributes: ["dateOfBirth"] },
//     });
//     for (let i = 0; i < data.length; i++) {
//       let firstName = data[i].dataValues.firstName;
//       let middleName = data[i].dataValues.middleName;
//       let lastName = data[i].dataValues.lastName;

//       let databaseDate = data[i].EmployeeDetail.dataValues.dateOfBirth;
//       let date = new Date(databaseDate).getDate();
//       let month = new Date(databaseDate).getMonth();
//       if (todayDate == date && thisMonth == month) {
//         console.log(
//           `happy birthday ${firstName}  ${middleName} ${lastName} enjoy your day`
//         );
//       } else {
//         console.log(`sorry `);
//       }
//     }

//     //console.log(data[0].dataValues.dateOfBirth);
//     let date = new Date();
//     console.log(date.toLocaleString());
//     //console.log(new Date(dataBaseDate).getMonth());
//   }
// );

// birthday.start();

// const interviewSchedule = nodeCron.schedule(
//   " 5 0 * * * ",
//   async function jobYouNeedToExecute(request, response) {
//     const todayDate = new Date().getDate();
//     const thisMonth = new Date().getMonth();

//     const data = await CandidateModel.findAll();
//     await Promise.all(
//       data.map((candidate) => {
//         let dataBase = candidate.dataValues;
//         const followUpDate = new Date(dataBase.followUpDate).getDate();
//         const followUpMonth = new Date(dataBase.followUpDate).getMonth();

//         const scheduleDate = new Date(dataBase.schedule).getDate();
//         const scheduleMonth = new Date(dataBase.schedule).getMonth();

//         const name = dataBase.fullName;
//         if (followUpDate == todayDate && followUpMonth == thisMonth) {
//           console.log(
//             `${name} you have an interview on ${dataBase.schedule} be prepared`
//           );
//         } else if (scheduleDate == todayDate && scheduleMonth == thisMonth) {
//           console.log(
//             `${name} you have an interview today ${dataBase.schedule} `
//           );
//         }
//       })
//     );

//     // console.log(data);
//   }
// );

// interviewSchedule.start();

app.listen(port, () => {
  console.log(`server is listening to the port :${port}`);
});
