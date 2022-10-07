module.exports = (sequelize, DataTypes) => {
    const UserLogin = sequelize.define("UserLogin", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: DataTypes.UUID,
      password: DataTypes.STRING,
      token: {
        type: DataTypes.STRING,
        allowNull: true,
        },
   
    });
    return UserLogin;
  };