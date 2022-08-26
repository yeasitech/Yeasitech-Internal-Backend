module.exports = (sequelize, DataTypes) => {
  const Designation = sequelize.define("Designation", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    designation: DataTypes.STRING,
    departmentId: DataTypes.INTEGER,
  });
  return Designation;
};
