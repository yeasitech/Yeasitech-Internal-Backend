module.exports = (sequelize, DataTypes) => {
  const Salary = sequelize.define("Salary", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: DataTypes.UUID,
    previousSalary: DataTypes.STRING,
    currentSalary: DataTypes.STRING,
    dateOfIncrement: DataTypes.STRING,
  });
  return Salary;
};
