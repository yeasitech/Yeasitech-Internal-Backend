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
const skillController = require("../controllers/skill.controller");
const payrollController = require("../controllers/payroll.controller");
const clientController = require("../controllers/client.controller");

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
const skillRouter = Router();
const payrollRouter = Router();
const clientRouter = Router();

//userRouter
userRouter.post("/createEmployee", userController.createUser);
userRouter.post("/login", userController.logIn);
userRouter.post("/employeeOnboarding", userController.employeeDetails);
userRouter.get("/getEmployee/:id", userController.allSingleUser);
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
userRouter.put("/makeAdmin/:id", AdminAuthorization, userController.makeAdmin);
userRouter.put(
  "/setDeactive/:id",
  AdminAuthorization,
  userController.setDeactive
);
userRouter.patch(
  "/changePassword",
  AdminAuthorization,
  userController.changePassword
);
userRouter.delete(
  "/deleteuser/:id",
  AdminAuthorization,
  userController.deleteUser
);

//salary
salaryRouter.post(
  "/employeeSalary",
  AdminAuthorization,
  salaryController.employeeSalary
);

salaryRouter.get("/:userId", AdminAuthorization, salaryController.getSalary);
salaryRouter.put(
  "/editSalary/:id",
  AdminAuthorization,
  salaryController.editSalary
);
//userRouter.put("/editProfile/:id", userController.editProfile);

//deptRouter
departmentRouter.post("/dept", departmentController.createDepartment);
departmentRouter.post("/designation", departmentController.createDesignation);
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
  "/createleave/:id",
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
candidateRouter.get(
  "/scheduleInterviewList/:candidateId",
  AdminAuthorization,
  candidateController.getInterviewByCandidate
);
//skills
skillRouter.post(
  "/createSkill",
  AdminAuthorization,
  skillController.createSkill
);
skillRouter.get("/suggestion", AdminAuthorization, skillController.getSkills);
skillRouter.delete("/:id", AdminAuthorization, skillController.deleteSkills);
skillRouter.put("/:id", AdminAuthorization, skillController.editSkills);
skillRouter.get("/list", AdminAuthorization, skillController.skillPagination);

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

//payroll
payrollRouter.post(
  "/create",
  AdminAuthorization,
  payrollController.createPayroll
);
payrollRouter.put(
  "/edit/:id",
  AdminAuthorization,
  payrollController.editPayroll
);
payrollRouter.put(
  "/isProcess/:id",
  AdminAuthorization,
  payrollController.editIsProcess
);
payrollRouter.get("/list", AdminAuthorization, payrollController.payrollList);
payrollRouter.delete(
  "/delete/:id",
  AdminAuthorization,
  payrollController.deletePayroll
);
//payrollSheet
// payrollRouter.post(
//   "/payrollSheet",
//   AdminAuthorization,
//   payrollController.createPayrollSheet
// );
payrollRouter.delete(
  "/deleteSheet/:id",
  AdminAuthorization,
  payrollController.deletePayrollSheet
);

payrollRouter.get(
  "/sheetList/:id",
  AdminAuthorization,
  payrollController.payrollSheetList
);

payrollRouter.get(
  "/single/:id",
  AdminAuthorization,
  payrollController.singlePayrollSheet
);

payrollRouter.put(
  "/editSheet/:id",
  AdminAuthorization,
  payrollController.editPayrollSheet
);

payrollRouter.put(
  "/payrollWithSheet/:id",
  AdminAuthorization,
  payrollController.editPayrollWithSheet
);
// payrollRouter.get(
//   "/htmlToPdf",
//   AdminAuthorization,
//   payrollController.htmlToPdf
// );

//Client routes
clientRouter.post(
  "/createClient",
  AdminAuthorization,
  clientController.createClient
);
clientRouter.get(
  "/clientList",
  AdminAuthorization,
  clientController.clientList
);
clientRouter.get(
  "/getSingleClient/:id",
  AdminAuthorization,
  clientController.getSingleClient
);
clientRouter.delete("/:id", AdminAuthorization, clientController.deleteClient);
clientRouter.put(
  "/editClient/:id",
  AdminAuthorization,
  clientController.editClient
);
clientRouter.get("/all", AdminAuthorization, clientController.allClient);
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
  skillRouter,
  payrollRouter,
  clientRouter,
};
