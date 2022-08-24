module.exports = (sequelize, DataTypes) => {
  const EmployeeExperience = sequelize.define("EmployeeExperience", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: DataTypes.UUID,
    // employeeName: DataTypes.STRING,
    workedOrganization: DataTypes.STRING,
    designation: DataTypes.STRING,
    salary: DataTypes.STRING,
    dateOfJoining: DataTypes.STRING,
    dateOfLeaving: DataTypes.STRING,
  });
  // EmployeeExperience.associate = function (models) {
  //   EmployeeExperience.belongsTo(models.User, {
  //     foreignKey: "userId",
  //   });
  // };
  return EmployeeExperience;
};
