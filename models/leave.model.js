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
    },
    leaveFrom: DataTypes.DATEONLY,
    leaveTo: DataTypes.DATEONLY,

    reasonOfLeave: DataTypes.STRING,
  });
  return Leave;
};
