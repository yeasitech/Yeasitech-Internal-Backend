const userController = require("../controllers/user.controller");
const { Router } = require("express");
const userRouter = Router();

userRouter.post("/createEmployee", userController.createUser);
userRouter.post("/login", userController.logIn);
userRouter.post("/employeeOnboarding", userController.employeeDetails);
module.exports = userRouter;
