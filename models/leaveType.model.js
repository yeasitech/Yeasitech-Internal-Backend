module.exports = (sequelize, DataTypes) => {
  const LeaveType = sequelize.define("LeaveType", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    typesOfLeave: DataTypes.STRING,
  });
  return LeaveType;
};
