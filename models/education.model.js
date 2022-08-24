module.exports = (sequelize, DataTypes) => {
  const EducationDetails = sequelize.define("EducationDetails", {
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
  // EducationDetails.associate = function (models) {
  //   EducationDetails.belongsTo(models.User, {
  //     foreignKey: "userId",
  //   });
  // };

  return EducationDetails;
};
