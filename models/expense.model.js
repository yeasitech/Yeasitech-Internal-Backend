module.exports = (sequelize, DataTypes) => {
  const Expenses = sequelize.define("Expenses", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    item: DataTypes.STRING,
    purchasedBy: DataTypes.STRING,
    purchaseFrom: DataTypes.STRING,
    purchaseDate: DataTypes.DATEONLY,
    amount: DataTypes.BIGINT,
    paidBy: DataTypes.STRING,
    userId: DataTypes.UUID,
    status: DataTypes.STRING,
  });

  Expenses.associate = function (models) {
    Expenses.belongsTo(models.User, {
      foreignKey: "userId",
    });
  };
  return Expenses;
};
