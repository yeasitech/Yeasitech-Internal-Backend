const userController = require("../controllers/user.controller");
const departmentController = require("../controllers/department.controller");
const { Router } = require("express");
const userRouter = Router();
const departmentRouter = Router();
//userRouter
userRouter.post("/createEmployee", userController.createUser);
userRouter.post("/login", userController.logIn);
userRouter.post("/employeeOnboarding", userController.employeeDetails);
userRouter.get("/allEmployeeDetails", userController.allUser);
userRouter.get("/employeeDetails/:id", userController.oneEmployeeDetails);

userRouter.post("/employeeSalary", userController.employeeSalary);

//userRouter.put("/editProfile/:id", userController.editProfile);

//deptRouter

departmentRouter.post("/dept", departmentController.department);
departmentRouter.post("/designation", departmentController.designation);
departmentRouter.get("/getAllDepartment", departmentController.getDepartment);
departmentRouter.get("/getAllDesignation", departmentController.getDesignation);
module.exports = { userRouter, departmentRouter };
