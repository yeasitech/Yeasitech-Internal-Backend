module.exports = (sequelize, DataTypes) => {
  const bankDetails = sequelize.define("bankDetails", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      onDelete: "cascade",
      onUpdate: "cascade",
    },
    bankName: DataTypes.STRING,
    accountNumber: DataTypes.STRING,
    ifscCode: DataTypes.STRING,
    userId: DataTypes.UUID,
  });
  return bankDetails;
};
