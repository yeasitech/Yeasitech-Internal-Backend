module.exports = (sequelize, DataTypes) => {
  const Salary = sequelize.define("Salary", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: DataTypes.UUID,
    currentSalary: DataTypes.INTEGER,
    dateOfIncrement: DataTypes.DATEONLY,
  });
  Salary.associate = function (models) {
    Salary.belongsTo(models.User, {
      foreignKey: "userId",
    });
  };
  return Salary;
};
