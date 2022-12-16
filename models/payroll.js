'use strict';
const {
  Model
} = require('sequelize');
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
  payroll.init({
    month: DataTypes.STRING,
    processingDate: DataTypes.DATE,
    generateDate: DataTypes.DATE,
    total: DataTypes.FLOAT,
    isProcessed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'payroll',
  });
  return payroll;
};