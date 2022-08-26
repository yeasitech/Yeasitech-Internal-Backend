const userController = require("../controllers/user.controller");
const deptController = require("../controllers/department.controller");
const { Router } = require("express");
const userRouter = Router();
//const deptRouter = Router();
//userRouter
userRouter.post("/createEmployee", userController.createUser);
userRouter.post("/login", userController.logIn);
userRouter.post("/employeeOnboarding", userController.employeeDetails);
userRouter.get("/allEmployeeDetails", userController.allUser);
userRouter.get("/employeeDetails/:id", userController.oneEmployeeDetails);

userRouter.post("/employeeSalary", userController.employeeSalary);

//userRouter.put("/editProfile/:id", userController.editProfile);

//deptRouter

userRouter.post("/dept", deptController.department);
module.exports = userRouter;
