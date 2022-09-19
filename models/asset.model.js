module.exports = (sequelize, DataTypes) => {
  const assets = sequelize.define("assets", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    assetDescription: DataTypes.TEXT,
    assetId: DataTypes.STRING,
    assetInvoice: DataTypes.STRING,
    purchaseFrom: DataTypes.STRING,
    purchaseDate: DataTypes.DATEONLY,
    assignTo: DataTypes.STRING,
    productId: DataTypes.STRING,
    userId: DataTypes.UUID,
  });
  return assets;
};
