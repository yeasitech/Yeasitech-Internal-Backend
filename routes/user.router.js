const userController = require("../controllers/user.controller");
const departmentController = require("../controllers/department.controller");
const salaryController = require("../controllers/salary.controller");
const holidayController = require("../controllers/holiday.controller");
const leaveController = require("../controllers/leave.controller");
const Authorization = require("../middleware/isAuth");
const { Router } = require("express");
const userRouter = Router();
const salaryRouter = Router();
const departmentRouter = Router();
const holidayRouter = Router();
const leaveRouter = Router();
//userRouter
userRouter.post("/createEmployee", userController.createUser);
userRouter.post("/login", userController.logIn);
userRouter.post("/employeeOnboarding", userController.employeeDetails);
userRouter.get("/getEmployee", Authorization, userController.allUser);
userRouter.get(
  "/employeeDetails/:id",
  Authorization,
  userController.oneEmployeeDetails
);
userRouter.get(
  "/designation/:designationId",
  Authorization,
  userController.getEmployeeByDesignation
);
userRouter.get("/list", Authorization, userController.getAllEmployeePagination);
//salary
salaryRouter.post(
  "/employeeSalary",
  Authorization,
  salaryController.employeeSalary
);

salaryRouter.get("/:userId", Authorization, salaryController.getSalary);
//userRouter.put("/editProfile/:id", userController.editProfile);

//deptRouter

departmentRouter.post(
  "/dept",
  Authorization,
  departmentController.createDepartment
);
departmentRouter.post(
  "/designation",
  Authorization,
  departmentController.createDesignation
);
departmentRouter.get(
  "/department",
  Authorization,
  departmentController.getDepartment
);
departmentRouter.get(
  "/designation/:departmentId",
  Authorization,
  departmentController.getDesignation
);
departmentRouter.delete(
  "/department/:id",
  Authorization,
  departmentController.deleteDepartment
);
departmentRouter.put(
  "/department/:id",
  Authorization,
  departmentController.editDepartment
);
departmentRouter.put(
  "/designation/:id",
  Authorization,
  departmentController.editDesignation
);
departmentRouter.delete(
  "/designation/:designationid",
  Authorization,
  departmentController.deleteDesignation
);
departmentRouter.get(
  "/departmentList",
  Authorization,
  departmentController.getAllDepartmentPagination
);
departmentRouter.get(
  "/designationList",
  Authorization,
  departmentController.getAllDesignationPagination
);
departmentRouter.get(
  "/list",
  Authorization,
  departmentController.getAllDepartmentDesignation
);
departmentRouter.put(
  "/:designationid",
  Authorization,
  departmentController.editDepartmentDesignation
);

//holiday
holidayRouter.post("/", Authorization, holidayController.createHoliday);
holidayRouter.get("/list", Authorization, holidayController.getAllHoliday);
holidayRouter.put(
  "/updateHoliday/:HolidayId",
  Authorization,
  holidayController.updateHoliday
);
holidayRouter.delete(
  "/:holidayId",
  Authorization,
  holidayController.deleteHoliday
);
//leave
leaveRouter.post("/leaveList", Authorization, leaveController.typesOfLeave);
leaveRouter.get("/list", Authorization, leaveController.getAlltypesOfLeave);
module.exports = {
  userRouter,
  departmentRouter,
  holidayRouter,
  leaveRouter,
  salaryRouter,
};
