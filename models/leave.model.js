// module.exports = (sequelize, DataTypes) => {
//   const Leave = sequelize.define("Leave", {
//     id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true,
//     },
//     dateOfApplication: DataTypes.DATEONLY,
//     dateOfLeave: DataTypes.DATEONLY,
//     reasonOfLeave: DataTypes.DATEONLY,
//     approved: DataTypes.BOOLEAN,
//     rejected: DataTypes.BOOLEAN,
//   });
//   return Leave;
// };

module.exports = (sequelize, DataTypes) => {
  const Leave = sequelize.define("Leave", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      onDelete: "cascade",
      onUpdate: "cascade",
    },
    userId: DataTypes.UUID,
    leaveType: DataTypes.INTEGER,
    leaveFrom: DataTypes.DATEONLY,
    leaveTo: DataTypes.DATEONLY,
    numberOfDays: DataTypes.INTEGER,
    reasonOfLeave: DataTypes.STRING,
  });
  return Leave;
};
