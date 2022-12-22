module.exports = (sequelize, DataTypes) => {
  const clientDetails = sequelize.define("clientDetails", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.BIGINT,
    clientId: DataTypes.STRING,
    companyName: DataTypes.STRING,
    birthday: { type: DataTypes.DATEONLY, allowNull: true },
    gender: DataTypes.STRING,
    address: DataTypes.STRING,
    profileImage: DataTypes.STRING,
    contactPerson: DataTypes.STRING,
    designation: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
  });
  clientDetails.associate = function (models) {};
  return clientDetails;
};
