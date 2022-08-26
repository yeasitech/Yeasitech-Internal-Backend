module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define("Department", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    department: DataTypes.STRING,
  });
  return Department;
};
