module.exports = (sequelize, DataTypes) => {
    const Expense = sequelize.define("Expense", {
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
      amount: DataTypes.INTEGER,
      paidBy: DataTypes.STRING,
      userId: DataTypes.UUID,
      status: DataTypes.STRING,
    });
    return Expense;
  };