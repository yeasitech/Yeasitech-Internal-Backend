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
  return Salary;
};
