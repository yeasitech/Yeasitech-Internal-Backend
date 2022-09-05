module.exports = (sequelize, DataTypes) => {
  const Holiday = sequelize.define("Holiday", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: DataTypes.STRING,
    holidayDate: DataTypes.DATEONLY,
  });
  return Holiday;
};
