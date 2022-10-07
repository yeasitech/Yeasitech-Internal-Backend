require("dotenv").config();
const dbConfig = require("../config/db.config");
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

//console.log(`directory Name`, __dirname);
//console.log(`File Name`, __filename);
//console.log(fs.readDirSync(__dirname));
const filenames = fs.readdirSync(__dirname).filter((file) => {
  //console.log(`<<<<<<<<<<<<<`, basename);
  //console.log(`1234567`, file.slice(-3));
});
//console.log(``, filenames);
sequelize
  .authenticate()
  .then(() => {
    console.log(`database is connected`);
  })
  .catch((err) => {
    console.log(err);
  });
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = require("./user.model")(sequelize, DataTypes);
db.EmployeeDetails = require("./employeeDetails.model")(sequelize, DataTypes);
db.EducationModel = require("./education.model")(sequelize, DataTypes);
db.ExperienceModel = require("./experience.model")(sequelize, DataTypes);
db.SalaryModel = require("./salary.model")(sequelize, DataTypes);
db.LeaveModel = require("./leave.model")(sequelize, DataTypes);
db.DesignationModel = require("./designation.model")(sequelize, DataTypes);
db.DepartmentModel = require("./department.model")(sequelize, DataTypes);
db.HolidayModel = require("./holiday.model")(sequelize, DataTypes);
db.LeaveTypeModel = require("./leaveType.model")(sequelize, DataTypes);
db.BankModel = require("./bankDeatils.model")(sequelize, DataTypes);
db.AssetModel = require("./asset.model")(sequelize, DataTypes);
db.CandidateModel = require("./candidate.model")(sequelize, DataTypes);
db.CommentModel = require("./comment.model")(sequelize, DataTypes);
db.InterviewModel = require("./interview.model")(sequelize, DataTypes);
db.ExpenseModel = require("./expense.model")(sequelize, DataTypes);
db.UserLoginModel = require("./userLogin.model")(sequelize, DataTypes);

// user & EmployeeDetails,Department,Designation
db.User.hasOne(db.EmployeeDetails, {
  foreignKey: "userId",
});
db.EmployeeDetails.belongsTo(db.User, { foreignKey: "userId" });
db.User.belongsTo(db.DepartmentModel, {
  foreignKey: "departmentId",
});
db.User.belongsTo(db.DesignationModel, {
  foreignKey: "designationId",
});

//user & ExperienceModel
db.User.hasMany(db.ExperienceModel, {
  foreignKey: "userId",
});
db.ExperienceModel.belongsTo(db.User, {
  foreignKey: "userId",
});

//user & EducationModel
db.User.hasMany(db.EducationModel, {
  foreignKey: "userId",
});
db.EducationModel.belongsTo(db.User, {
  foreignKey: "userId",
});

//user & SalaryModel
db.User.hasMany(db.SalaryModel, { foreignKey: "userId" });
db.SalaryModel.belongsTo(db.User, { foreignKey: "userId" });

//user & Department
db.DepartmentModel.hasOne(db.EmployeeDetails, {
  foreignKey: "departmentId",
});
db.EmployeeDetails.belongsTo(db.DepartmentModel, {
  foreignKey: "departmentId",
});

//user & Designation
db.DepartmentModel.hasMany(db.DesignationModel, {
  foreignKey: "departmentId",
});
db.DesignationModel.belongsTo(db.DepartmentModel, {
  foreignKey: "departmentId",
});

//user & leave model
db.User.hasMany(db.LeaveModel, { foreignKey: `userId` });
db.LeaveModel.belongsTo(db.User, { foreignKey: `userId` });

//User & bankModel
db.User.hasMany(db.BankModel, { foreignKey: "userId" });
db.BankModel.belongsTo(db.User, { foreignKey: "userId" });

// user & assetModel
db.User.hasMany(db.AssetModel, { foreignKey: "userId" });
db.AssetModel.belongsTo(db.User, { foreignKey: "userId" });

//candidate & user;
db.User.hasMany(db.InterviewModel, { foreignKey: "interviewAssignTo" });
db.InterviewModel.belongsTo(db.User, { foreignKey: "interviewAssignBy" });

// candidate & interview
db.CandidateModel.hasOne(db.InterviewModel, { foreignKey: "candidateId" });
db.InterviewModel.belongsTo(db.CandidateModel, { foreignKey: "candidateId" });

//candidate & comments;
db.CandidateModel.hasMany(db.CommentModel, { foreignKey: "candidateId" });
db.CommentModel.belongsTo(db.CandidateModel, { foreignKey: "candidateId" })
db.User.hasMany(db.ExpenseModel, { foreignKey: "userId" });
 db.ExpenseModel.belongsTo(db.User, { foreignKey: "userId" });
//userLogin & user;

db.User.hasMany(db.ExpenseModel, { foreignKey: "userId" });
 db.ExpenseModel.belongsTo(db.User, { foreignKey: "userId" });
//userLogin & user;

 db.User.hasMany(db.UserLoginModel, { foreignKey: "userId" });
 db.UserLoginModel.belongsTo(db.User, { foreignKey: "userId" });



// if (process.env.ENV === "dev") {
//   sequelize
//     .sync({ alter: true })
//     .then(() => {
//       console.log(`database is syncing`);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }
module.exports = db;
