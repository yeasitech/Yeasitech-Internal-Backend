module.exports = (sequelize, DataTypes) => {
  const Designation = sequelize.define("Designation", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      // onDelete: "cascade",
      // onUpdate: "cascade",
    },
    designation: DataTypes.STRING,
    departmentId: { type: DataTypes.INTEGER, allowNull: true },
  });
  Designation.associate = function (models) {
    Designation.belongsTo(models.Department, {
      foreignKey: "departmentId",
    });
  };
  return Designation;
};
