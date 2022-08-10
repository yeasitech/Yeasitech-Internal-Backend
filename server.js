require("dotenv").config();
const userRouter = require("./routes/user.router.js");
const express = require("express");
const app = express();
const cors = require("cors");
//const userRouter = require("./routes/user.router");

const port = process.env.PORT;
const models = require("./models/index");
var corsOptions = { origin: `https://localhost:${port}` };
app.use(cors(corsOptions));

app.use(express.json());

app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`server is listening to the port :${port}`);
});
