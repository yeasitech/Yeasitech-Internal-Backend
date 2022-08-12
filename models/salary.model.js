module.exports = (sequelize, DataTypes) => {
  const salary = sequelize.define("salary", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    previousCompanySalary: DataTypes.INTEGER,
    currentSalary: DataTypes.INTEGER,
    dateOfIncrement: DataTypes.INTEGER,
  });
};
