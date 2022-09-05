const userController = require("../controllers/user.controller");
const departmentController = require("../controllers/department.controller");
const salaryController = require("../controllers/salary.controller");
const holidayController = require("../controllers/holiday.controller");
const { Router } = require("express");
const userRouter = Router();
const departmentRouter = Router();
const holidayRouter = Router();
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
  "/deleteDesignation/:designationid",
  departmentController.deleteDesignation
);
departmentRouter.get(
  "/getAllDepartmentPagination",
  departmentController.getAllDepartmentPagination
);
departmentRouter.get(
  "/getAllDesignationPagination",
  departmentController.getAllDesignationPagination
);
departmentRouter.get(
  "/getAllDepartmentDesignation",
  departmentController.getAllDepartmentDesignation
);
departmentRouter.put(
  "/editDepartmentDesignation/:designationid",
  departmentController.editDepartmentDesignation
);

//holiday
holidayRouter.post("/createHoliday", holidayController.createHoliday);
holidayRouter.get("/getAllHoliday", holidayController.getAllHoliday);
holidayRouter.put("/updateHoliday", holidayController.getAllHoliday);
module.exports = { userRouter, departmentRouter, holidayRouter };
