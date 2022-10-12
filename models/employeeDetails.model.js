const { user } = require("./index");

module.exports = (sequelize, DataTypes) => {
  const EmployeeDetails = sequelize.define("EmployeeDetails", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: DataTypes.UUID,
    contactNo: DataTypes.BIGINT,
    emergencyContactNo: DataTypes.BIGINT,
    permanentAddress: DataTypes.STRING,
    currentAddress: DataTypes.STRING,
    gender: DataTypes.STRING,
    dateOfBirth: DataTypes.DATEONLY,
    guardianName: DataTypes.STRING,
    employeeId: DataTypes.STRING,
    employeeImage: DataTypes.STRING,
    aadharNumber: DataTypes.BIGINT,
    aadharFrontImage: DataTypes.STRING,
    aadharBackImage: DataTypes.STRING,
    voterIdNo: DataTypes.STRING,
    voterFrontImage: DataTypes.STRING,
    voterBackIamge: DataTypes.STRING,
    panNo: DataTypes.STRING,
    panFrontImage: DataTypes.STRING,
    panBackImage: DataTypes.STRING,
    passportNo: DataTypes.STRING,
    passportFrontImage: DataTypes.STRING,
    passportBackImage: DataTypes.STRING,
  });
  EmployeeDetails.associate = function (models) {
    EmployeeDetails.belongsTo(models.User, {
      foreignKey: "userId",
    });
    // EmployeeDetails.belongsTo(models.Department, {
    //   foreignKey: "departmentId",
    // });
  };
  return EmployeeDetails;
};
