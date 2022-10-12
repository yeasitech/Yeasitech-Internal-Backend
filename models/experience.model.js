module.exports = (sequelize, DataTypes) => {
  const EmployeeExperience = sequelize.define("EmployeeExperience", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: DataTypes.UUID,

    workedOrganization: DataTypes.STRING,
    designation: DataTypes.STRING,
    salary: DataTypes.BIGINT,
    dateOfJoining: DataTypes.DATEONLY,
    dateOfLeaving: DataTypes.DATEONLY,
  });
  EmployeeExperience.associate = function (models) {
    EmployeeExperience.belongsTo(models.User, {
      foreignKey: "userId",
    });
  };
  return EmployeeExperience;
};
