const { user } = require("./index");

module.exports = (sequelize, DataTypes) => {
  const EmployeeDetails = sequelize.define("EmployeeDetails", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: DataTypes.UUID,
    contactNo: DataTypes.STRING,
    emergencyContactNo: DataTypes.STRING,
    permanentAddress: DataTypes.STRING,
    currentAddress: DataTypes.STRING,
    gender: DataTypes.STRING,
    dateOfBirth: DataTypes.STRING,
    guardianName: DataTypes.STRING,
    employeeId: DataTypes.STRING,
    employeeImage: DataTypes.STRING,
    aadharNumber: DataTypes.STRING,
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
  // EmployeeDetails.associate = function (models) {
  //   EmployeeDetails.belongsTo(models.User, {
  //     foreignKey: "userId",
  //   });
  // };
  return EmployeeDetails;
};
