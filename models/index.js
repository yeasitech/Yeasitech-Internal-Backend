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
db.user = require("./user.model")(sequelize, DataTypes);

// sequelize
//   .sync({ force: false })
//   .then(() => {
//     console.log(`database is syncing`);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
module.exports = db;
