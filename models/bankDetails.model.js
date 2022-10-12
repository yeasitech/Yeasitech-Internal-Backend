module.exports = (sequelize, DataTypes) => {
  const BankDetails = sequelize.define("BankDetails", {
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
    passbookImage: DataTypes.STRING,
  });
  BankDetails.associate = function (models) {
    BankDetails.belongsTo(models.User, {
      foreignKey: "userId",
    });
  };
  return BankDetails;
};
