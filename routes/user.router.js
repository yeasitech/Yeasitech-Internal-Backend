const userController = require("../controllers/user.controller");
const departmentController = require("../controllers/department.controller");
const salaryController = require("../controllers/salary.controller");
const holidayController = require("../controllers/holiday.controller");
const leaveController = require("../controllers/leave.controller");
const assetController = require("../controllers/asset.controller");
const candidateController = require("../controllers/candidate.controller");
const commentController = require("../controllers/comment.controller");
const expenseController = require("../controllers/expense.controller");
const userLoginController = require("../controllers/userlogin.controller");
const Authorization = require("../middleware/isAuth");
const AdminAuthorization = require("../middleware/isAdmin");
const { Router } = require("express");
const userRouter = Router();
const salaryRouter = Router();
const departmentRouter = Router();
const holidayRouter = Router();
const leaveRouter = Router();
const assetRouter = Router();
const candidateRouter = Router();
const commentRouter = Router();
const expenseRouter = Router();
const userLoginRouter = Router();

//userRouter
userRouter.post(
  "/createEmployee",
  AdminAuthorization,
  userController.createUser
);
userRouter.post("/login", userController.logIn);
userRouter.post("/employeeOnboarding", userController.employeeDetails);
userRouter.get("/getEmployee/:id", Authorization, userController.allSingleUser);
userRouter.get("/getAllEmployee", Authorization, userController.allEmployee);
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
userRouter.get("/searchEmpList", Authorization, userController.searchUser);
userRouter.put(
  "/personalData/:userId",
  Authorization,
  userController.editOneEmployeePersonalData
);
userRouter.put("/education/:id", Authorization, userController.updateEducation);
userRouter.put(
  "/experience/:id",
  Authorization,
  userController.updateExperience
);
userRouter.put("/bankDetails/:id", Authorization, userController.bankUpdate);
userRouter.put("/makeAdmin/:id", AdminAuthorization, userController.makeAdmin);
userRouter.put(
  "/setDeactive/:id",
  AdminAuthorization,
  userController.setDeactive
);

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
  AdminAuthorization,
  departmentController.createDepartment
);
departmentRouter.post(
  "/designation",
  AdminAuthorization,
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
departmentRouter.get(
  "/allDesignation",
  Authorization,
  departmentController.getAllDesignation
);
departmentRouter.delete(
  "/department/:id",
  AdminAuthorization,
  departmentController.deleteDepartment
);
departmentRouter.put(
  "/department/:id",
  AdminAuthorization,
  departmentController.editDepartment
);
departmentRouter.put(
  "/designation/:id",
  AdminAuthorization,
  departmentController.editDesignation
);
departmentRouter.delete(
  "/designation/:designationId",
  AdminAuthorization,
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
  "/editBoth/:designationid",
  AdminAuthorization,
  departmentController.editDepartmentDesignation
);

//holiday
holidayRouter.post("/", AdminAuthorization, holidayController.createHoliday);
holidayRouter.get("/list", Authorization, holidayController.getAllHoliday);
holidayRouter.put(
  "/updateHoliday/:HolidayId",
  AdminAuthorization,
  holidayController.updateHoliday
);
holidayRouter.delete(
  "/:holidayId",
  AdminAuthorization,
  holidayController.deleteHoliday
);
holidayRouter.get(
  "/holidayList",
  Authorization,
  holidayController.holidayPagination
);
//leave
leaveRouter.post("/leaveList", Authorization, leaveController.typesOfLeave);
leaveRouter.get(
  "/allTypeOfLeave",
  Authorization,
  leaveController.getAlltypesOfLeave
);
leaveRouter.post(
  "/createleave/:userId",
  Authorization,
  leaveController.createLeaveByUser
);
leaveRouter.get("/list", Authorization, leaveController.getLeavePagiantion);
leaveRouter.put(
  "/editLeave/:id",
  AdminAuthorization,
  leaveController.leaveUpdate
);
leaveRouter.put(
  "/editStatusLeave/:id",
  AdminAuthorization,
  leaveController.leaveStatusUpdate
);
leaveRouter.delete(
  "/deleteLeave/:id",
  AdminAuthorization,
  leaveController.deleteLeave
);

//Assets
assetRouter.post(
  "/createAssets",
  AdminAuthorization,
  assetController.createAssets
);
assetRouter.get(
  "/assetList",
  Authorization,
  assetController.getAssetsPagination
);
assetRouter.put(
  "/updateAsset/:id",
  AdminAuthorization,
  assetController.updateAsset
);
assetRouter.delete(
  "/deleteAsset/:id",
  AdminAuthorization,
  assetController.deleteAsset
);
assetRouter.get(
  "/getAsset/:assetId",
  Authorization,
  assetController.getSingleAsset
);

//Candidate
candidateRouter.post(
  "/createCandidate",
  AdminAuthorization,
  candidateController.createCandidate
);
candidateRouter.put(
  "/updateCandidate/:id",
  AdminAuthorization,
  candidateController.candidateUpdate
);
candidateRouter.delete(
  "/deleteCandidate/:id",
  AdminAuthorization,
  candidateController.deleteCandidate
);
candidateRouter.get(
  "/list",
  Authorization,
  candidateController.candidatePagination
);
candidateRouter.get(
  "/getCandidate/:candidateId",
  Authorization,
  candidateController.getCandidate
);
// candidateRouter.get(
//   "/createInterview/:candidateId",
//   candidateController.createInterview
// );

//comment;
commentRouter.post(
  "/createComment/:candidateId",
  AdminAuthorization,
  commentController.createComment
);
commentRouter.get(
  "/getComment/:candidateId",
  Authorization,
  commentController.getComment
);
commentRouter.post(
  "/updateComment",
  AdminAuthorization,
  commentController.updateComments
);
//expense
expenseRouter.post(
  "/addExpense",
  AdminAuthorization,
  expenseController.addExpense
);
expenseRouter.get(
  "/getExpenses",
  AdminAuthorization,
  expenseController.getExpenses
);

expenseRouter.get(
  "/getExpenseList",
  AdminAuthorization,
  expenseController.getExpenseList
);
expenseRouter.put(
  "/:id",
  AdminAuthorization,
  expenseController.updateExpense
);
expenseRouter.patch(
  "/status/:id",
  AdminAuthorization,
  expenseController.updateExpenseStatus
);
expenseRouter.delete(
  "/:id",
  AdminAuthorization,
  expenseController.deleteExpense
);
//userLoginPassword create
userLoginRouter.post(
  "/",
  AdminAuthorization,
  userLoginController.userLoginTokenGenerate
);
userLoginRouter.put(
  "/resetPassword",
  AdminAuthorization,
  userLoginController.resetPassword
);

module.exports = {
  userRouter,
  departmentRouter,
  holidayRouter,
  leaveRouter,
  salaryRouter,
  assetRouter,
  candidateRouter,
  commentRouter,
  expenseRouter,
  userLoginRouter,
};
