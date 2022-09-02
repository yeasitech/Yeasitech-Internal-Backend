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
userRouter.get(
  "/getAllEmployeePagination",
  userController.getAllEmployeePagination
);
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
  "/deleteDepartment/:id",
  departmentController.deleteDepartment
);
departmentRouter.put(
  "/updateDepartment/:id",
  departmentController.editDepartment
);
departmentRouter.put(
  "/updateDesignation/:id",
  departmentController.editDesignation
);
departmentRouter.delete(
  "/deleteDesignation",
  departmentController.deleteDesignation
);
departmentRouter.get(
  "/getAllDepartmentPagiantion",
  departmentController.getAllDepartmentPagination
);
departmentRouter.get(
  "/getAllDesignationPagiantion",
  departmentController.getAllDesignationPagination
);
departmentRouter.get(
  "/getAllDepartmentDesignation",
  departmentController.getAllDepartmentDesignation
);

module.exports = { userRouter, departmentRouter };
