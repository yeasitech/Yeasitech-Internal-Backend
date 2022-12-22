"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class payrollSheet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  payrollSheet.init(
    {
      name: DataTypes.STRING,
      salary: DataTypes.FLOAT,
      presentDays: DataTypes.INTEGER,
      totalSalary: DataTypes.FLOAT,
      tax: DataTypes.FLOAT,
      bonus: DataTypes.FLOAT,
      totalDays: DataTypes.INTEGER,
      totalPayable: DataTypes.FLOAT,
      payrollId: DataTypes.INTEGER,
      userId: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "payrollSheet",
    }
  );
  return payrollSheet;
};
