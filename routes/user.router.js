const userController = require("../controllers/user.controller");
const departmentController = require("../controllers/department.controller");
const salaryController = require("../controllers/salary.controller");
const holidayController = require("../controllers/holiday.controller");
const leaveController = require("../controllers/leave.controller");
const assetController = require("../controllers/asset.controller");
const candidateController = require("../controllers/candidate.controller");
const commentController = require("../controllers/comment.controller");
const expenseController = require("../controllers/expense.controller");
const userLoginController = require("../controllers/userLogin.controller");
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
userRouter.post("/createEmployee", userController.createUser);
userRouter.post("/login", userController.logIn);
userRouter.post("/employeeOnboarding", userController.employeeDetails);
userRouter.get(
  "/getEmployee/:id",
  AdminAuthorization,
  userController.allSingleUser
);
userRouter.get(
  "/getAllEmployee",
  AdminAuthorization,
  userController.allEmployee
);
userRouter.get(
  "/employeeDetails/:id",
  AdminAuthorization,
  userController.oneEmployeeDetails
);
userRouter.get(
  "/designation/:designationId",
  AdminAuthorization,
  userController.getEmployeeByDesignation
);
userRouter.get(
  "/list",
  AdminAuthorization,
  userController.getAllEmployeePagination
);
userRouter.get("/searchEmpList", AdminAuthorization, userController.searchUser);
userRouter.put(
  "/personalData",
  AdminAuthorization,
  userController.editOneEmployeePersonalData
);
userRouter.put(
  "/education/:id",
  AdminAuthorization,
  userController.updateEducation
);
userRouter.put(
  "/experience/:id",
  AdminAuthorization,
  userController.updateExperience
);
userRouter.put(
  "/bankDetails/:id",
  AdminAuthorization,
  userController.bankUpdate
);
userRouter.put("/makeAdmin", AdminAuthorization, userController.makeAdmin);
userRouter.put("/setDeactive", AdminAuthorization, userController.setDeactive);

//salary
salaryRouter.post(
  "/employeeSalary",
  AdminAuthorization,
  salaryController.employeeSalary
);

salaryRouter.get("/:userId", AdminAuthorization, salaryController.getSalary);
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
  AdminAuthorization,
  departmentController.getDepartment
);
departmentRouter.get(
  "/designation/:departmentId",
  AdminAuthorization,
  departmentController.getDesignation
);
departmentRouter.get(
  "/allDesignation",
  AdminAuthorization,
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
  AdminAuthorization,
  departmentController.getAllDepartmentPagination
);
departmentRouter.get(
  "/designationList",
  AdminAuthorization,
  departmentController.getAllDesignationPagination
);
departmentRouter.get(
  "/list",
  AdminAuthorization,
  departmentController.getAllDepartmentDesignation
);
departmentRouter.put(
  "/editBoth/:designationid",
  AdminAuthorization,
  departmentController.editDepartmentDesignation
);

//holiday
holidayRouter.post("/", AdminAuthorization, holidayController.createHoliday);
holidayRouter.get("/list", AdminAuthorization, holidayController.getAllHoliday);
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
  AdminAuthorization,
  holidayController.holidayPagination
);
//leave
leaveRouter.post(
  "/leaveList",
  AdminAuthorization,
  leaveController.typesOfLeave
);
leaveRouter.get(
  "/allTypeOfLeave",
  AdminAuthorization,
  leaveController.getAlltypesOfLeave
);
leaveRouter.post(
  "/createleave",
  AdminAuthorization,
  leaveController.createLeaveByUser
);
leaveRouter.get(
  "/list",
  AdminAuthorization,
  leaveController.getLeavePagiantion
);
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
  AdminAuthorization,
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
  AdminAuthorization,
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
  AdminAuthorization,
  candidateController.candidatePagination
);
candidateRouter.get(
  "/getCandidate/:candidateId",
  AdminAuthorization,
  candidateController.getCandidate
);
candidateRouter.post(
  "/createInterview/:candidateId",
  AdminAuthorization,
  candidateController.createInterview
);
candidateRouter.put(
  "/upadateInterview/:interviewId",
  AdminAuthorization,
  candidateController.updateInterview
);
candidateRouter.delete(
  "/deleteInterview/:interviewId",
  AdminAuthorization,
  candidateController.deleteInterview
);
candidateRouter.get(
  "/interviewList",
  AdminAuthorization,
  candidateController.interviewPagination
);

//comment;
commentRouter.post(
  "/createComment/:candidateId",
  AdminAuthorization,
  commentController.createComment
);
commentRouter.get(
  "/getComment/:candidateId",
  AdminAuthorization,
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
expenseRouter.put("/:id", AdminAuthorization, expenseController.updateExpense);
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
userLoginRouter.put("/:token", userLoginController.resetPassword);

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
