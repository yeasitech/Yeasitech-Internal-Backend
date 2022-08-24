require("dotenv").config();
const dbConfig = require("../config/db.config");

// const fs = require("fs");
// const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
// const basename = path.basename(__filename);
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

db.User.hasOne(db.EmployeeDetails, { foreignKey: "userId" });
db.EmployeeDetails.belongsTo(db.User, { foreignKey: "userId" });

db.User.hasMany(db.EmployeeExperience, { foreignKey: "userId" });
db.EmployeeExperience.belongsTo(db.User, { foreignKey: "userId" });

db.User.hasMany(db.EducationDetails, { foreignKey: "userId" });
db.EducationDetails.belongsTo(db.User, { foreignKey: "userId" });

db.User.hasMany(db.Salary, { foreignKey: "userId" });
db.Salary.belongsTo(db.User, { foreignKey: "userId" });

// sequelize
//   .sync({ alter: true })
//   .then(() => {
//     console.log(`database is syncing`);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
module.exports = db;
