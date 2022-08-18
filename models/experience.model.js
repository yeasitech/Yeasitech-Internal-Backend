module.exports = (sequelize, DataTypes) => {
  const employeeExperience = sequelize.define("employeeExperience", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: DataTypes.UUID,
    // employeeName: DataTypes.STRING,
    workedOrganization: DataTypes.STRING,
    designation: DataTypes.STRING,
    salary: DataTypes.STRING,
    dateOfJoining: DataTypes.STRING,
    dateOfLeaving: DataTypes.STRING,
  });
  employeeExperience.associate = function (models) {
    employeeExperience.belongsTo(models.User, {
      foreignKey: "userId",
    });
  };
  return employeeExperience;
};
