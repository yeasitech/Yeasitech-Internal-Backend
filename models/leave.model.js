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
      allowNull: false,
      primaryKey: true,
    },
    leaveDateFron: DataTypes.DATEONLY,
    leaveDateFronTo: DataTypes.DATEONLY,
    reasonOfLeave: DataTypes.DATEONLY,
    approved: DataTypes.BOOLEAN,
    rejected: DataTypes.BOOLEAN,
  });
  return Leave;
};
