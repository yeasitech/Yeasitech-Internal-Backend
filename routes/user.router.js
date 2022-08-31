const userController = require("../controllers/user.controller");
const departmentController = require("../controllers/department.controller");
const salaryController = require("../controllers/salary.controller");
const { Router } = require("express");
const userRouter = Router();
const departmentRouter = Router();
//userRouter
userRouter.post("/createEmployee", userController.createUser);
userRouter.post("/login", userController.logIn);
userRouter.post("/employeeOnboarding", userController.employeeDetails);
userRouter.get("/allEmployeeDetails", userController.allUser);
userRouter.get("/employeeDetails/:id", userController.oneEmployeeDetails);

userRouter.post("/employeeSalary", salaryController.employeeSalary);

userRouter.get("/getEmployeeSalary/:userId", salaryController.getSalary);

//userRouter.put("/editProfile/:id", userController.editProfile);

//deptRouter

departmentRouter.post("/dept", departmentController.createDepartment);
departmentRouter.post("/designation", departmentController.createDesignation);
departmentRouter.get("/getAllDepartment", departmentController.getDepartment);
departmentRouter.get(
  "/getAllDesignation/:departmentId",
  departmentController.getDesignation
);
departmentRouter.delete(
  "/deleteDepartment",
  departmentController.deleteDepartment
);
module.exports = { userRouter, departmentRouter };
