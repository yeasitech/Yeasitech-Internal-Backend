const userController = require("../controllers/user.controller");
const { Router } = require("express");
const userRouter = Router();

userRouter.post("/createEmployee", userController.createUser);
userRouter.post("/login", userController.logIn);
userRouter.post("/employeeOnboarding", userController.employeeDetails);
userRouter.get("/allEmployeeDeatils", userController.allUser);
userRouter.get("/employeeDetails/:id", userController.oneEmployeeDetails);

userRouter.post("/employeeSalary", userController.employeeSalary);

userRouter.put("/editProfile", userController.editProfile);
module.exports = userRouter;
