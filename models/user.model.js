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
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    isActive: DataTypes.BOOLEAN,
    isVerified: DataTypes.BOOLEAN,
  });

  User.associate = function (models) {
    User.hasOne(models.employeeDetails, {
      foreignKey: "userId",
    });
    User.hasMany(models.educationDetails, {
      foreignKey: "userId",
    });
    User.hasMany(models.experienceDetails, {
      foreignKey: "userId",
    });
  };

  return User;
};
