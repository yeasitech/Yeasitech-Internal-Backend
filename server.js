require("dotenv").config();
const {
  userRouter,
  departmentRouter,
  holidayRouter,
  leaveRouter,
} = require("./routes/user.router");
const express = require("express");
const app = express();
const cors = require("cors");

const port = process.env.PORT || 5000;
const models = require("./models/index");
var corsOptions = { origin: "*" };
app.use(cors(corsOptions));

app.use(express.json());

app.use("/user", userRouter);
app.use("/public", departmentRouter);
app.use("/public", holidayRouter);
app.use("/public", leaveRouter);

app.listen(port, () => {
  console.log(`server is listening to the port :${port}`);
});
