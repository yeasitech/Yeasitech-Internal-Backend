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
      userId: DataTypes.UUID,
      salary: DataTypes.FLOAT,
      presentDays: DataTypes.INTEGER,
      totalSalary: DataTypes.FLOAT,
      tax: DataTypes.FLOAT,
      bonus: DataTypes.FLOAT,
      totalPayable: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "payrollSheet",
    }
  );
  payrollSheet.associate = function (models) {
    payrollSheet.belongsTo(models.payroll, {
      foreignKey: "payrollId",
    });
  };

  return payrollSheet;
};
