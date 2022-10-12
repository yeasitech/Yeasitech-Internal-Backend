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
    dateOfJoining: DataTypes.DATEONLY,
    designationId: DataTypes.INTEGER,
    departmentId: { type: DataTypes.INTEGER, allowNull: true },
    employeeType: DataTypes.STRING,
    onBoardingStatus: DataTypes.BOOLEAN,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    isActive: DataTypes.BOOLEAN,
    isVerified: DataTypes.BOOLEAN,
  });

  User.associate = function (models) {
    User.hasOne(models.EmployeeDetails, {
      foreignKey: "userId",
    });
    User.belongsTo(models.Department, {
      foreignKey: "departmentId",
    });
    User.belongsTo(models.Designation, {
      foreignKey: "designationId",
    });
    User.hasMany(models.EducationDetails, {
      foreignKey: "userId",
    });
    User.hasMany(models.EmployeeExperience, {
      foreignKey: "userId",
    });
    User.hasMany(models.Salary, {
      foreignKey: "userId",
    });
    User.hasMany(models.Leave, {
      foreignKey: "userId",
    });
    User.hasMany(models.BankDetails, {
      foreignKey: "userId",
    });
    User.hasMany(models.Assets, {
      foreignKey: "userId",
    });
    User.hasMany(models.Interview, {
      foreignKey: "interviewAssignTo",
      as: "InterviewAssignedTo",
    });
    User.hasMany(models.Interview, {
      foreignKey: "interviewAssignBy",
      as: "InterviewAssignedBy",
    });
    User.hasMany(models.Expenses, {
      foreignKey: "userId",
    });
    User.hasMany(models.UserLogin, {
      foreignKey: "userId",
    });
  };

  return User;
};
