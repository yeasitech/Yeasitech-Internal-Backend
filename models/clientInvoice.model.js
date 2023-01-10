module.exports = (sequelize, DataTypes) => {
  const clientInvoice = sequelize.define("clientInvoice", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    item: DataTypes.STRING,
    //description: DataTypes.STRING,
    unitCost: DataTypes.BIGINT,
    quantity: DataTypes.INTEGER,
    amount: DataTypes.BIGINT,
    status: DataTypes.STRING,
    clientId: DataTypes.INTEGER,
  });
  clientInvoice.associate = function (models) {
    clientInvoice.belongsTo(models.clientDetails, {
      foreignKey: "clientId",
    });
  };
  return clientInvoice;
};
