module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define("Department", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      onDelete: "cascade",
      onUpdate: "cascade",
    },

    department: DataTypes.STRING,
  });
  Department.associate = function (models) {
    // Department.hasOne(models.EmployeeDetails, {
    //   foreignKey: "departmentId",
    // });
    Department.hasMany(models.Designation, {
      foreignKey: "departmentId",
    });
  };
  return Department;
};
