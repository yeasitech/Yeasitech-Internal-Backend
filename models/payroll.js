"use strict";
const { Model, INTEGER } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class payroll extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  payroll.init(
    {
      month: DataTypes.STRING,
      processingDate: DataTypes.DATEONLY,
      isProcessed: DataTypes.BOOLEAN,
      generateDate: DataTypes.DATEONLY,
      total: DataTypes.FLOAT,
      //totalDays: { types: DataTypes.INTEGER, defaultValue: 30 },
    },
    {
      sequelize,
      modelName: "payroll",
    }
  );
  payroll.associate = function (models) {
    payroll.hasMany(models.payrollSheet, {
      foreignKey: "payrollId",
    });
  };

  return payroll;
};
