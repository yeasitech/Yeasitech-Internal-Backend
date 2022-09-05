module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    firstName: DataTypes.STRING,
    middleName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    dateOfJoining: DataTypes.STRING,
    designationId: DataTypes.INTEGER,
    //designation: DataTypes.STRING,
    departmentId: { type: DataTypes.INTEGER, allowNull: true },
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    isActive: DataTypes.BOOLEAN,
    isVerified: DataTypes.BOOLEAN,
  });

  // User.associate = function (models) {
  //   User.hasOne(models.EmployeeDetails, {
  //     foreignKey: "userId",
  //   });
  //   User.hasMany(models.EducationDetails, {
  //     foreignKey: "userId",
  //   });
  //   User.hasMany(models.ExperienceDetails, {
  //     foreignKey: "userId",
  //   });
  // };

  return User;
};
