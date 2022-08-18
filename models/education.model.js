module.exports = (sequelize, DataTypes) => {
  const educationDetails = sequelize.define("educationDetails", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: { type: DataTypes.UUID },
    schoolOrcollegeName: DataTypes.STRING,
    percentage: DataTypes.STRING,
    passoutYear: DataTypes.STRING,
    specialization: DataTypes.STRING,
    type: DataTypes.STRING, // X / XII / Graduation / Master / PHD
  });
  educationDetails.associate = function (models) {
    educationDetails.belongsTo(models.User, {
      foreignKey: "userId",
    });
  };

  return educationDetails;
};
