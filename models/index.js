require("dotenv").config();
const dbConfig = require("../config/db.config");

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
db.EducationDetails = require("./education.model")(sequelize, DataTypes);
db.EmployeeExperience = require("./experience.model")(sequelize, DataTypes);
db.Salary = require("./salary.model")(sequelize, DataTypes);
db.Leave = require("./leave.model")(sequelize, DataTypes);
db.Desigantion = require("./designation.model")(sequelize, DataTypes);
db.Department = require("./department.model")(sequelize, DataTypes);

db.User.hasOne(db.EmployeeDetails, { foreignKey: "userId" });
db.EmployeeDetails.belongsTo(db.User, { foreignKey: "userId" });
db.User.belongsTo(db.Department, { foreignKey: "departmentId" });

db.User.hasMany(db.EmployeeExperience, { foreignKey: "userId" });
db.EmployeeExperience.belongsTo(db.User, { foreignKey: "userId" });

db.User.hasMany(db.EducationDetails, { foreignKey: "userId" });
db.EducationDetails.belongsTo(db.User, { foreignKey: "userId" });

db.User.hasMany(db.Salary, { foreignKey: "userId" });
db.Salary.belongsTo(db.User, { foreignKey: "userId" });

db.Department.hasOne(db.EmployeeDetails, { foreignKey: "departmentId" });
db.EmployeeDetails.belongsTo(db.Department, { foreignKey: "departmentId" });

db.Department.hasMany(db.Desigantion, { foreignKey: "departmentId" });
db.Desigantion.belongsTo(db.Department, { foreignKey: "departmentId" });

// sequelize
//   .sync({ alter: true })
//   .then(() => {
//     console.log(`database is syncing`);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
module.exports = db;
