module.exports = (sequelize, DataTypes) => {
  const leave = sequelize.define("leave", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    dateOfApplication: DataTypes.INTEGER,
    dateOfLeave: DataTypes.INTEGER,
    reasonOfLeave: DataTypes.INTEGER,
    approved: DataTypes.BOOLEAN,
    rejected: DataTypes.BOOLEAN,
  });
  return leave;
};
