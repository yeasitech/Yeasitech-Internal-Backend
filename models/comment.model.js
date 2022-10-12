module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define("Comments", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    comment: DataTypes.TEXT,
    candidateId: DataTypes.INTEGER,
    userId: DataTypes.UUID,
  });
  Comments.associate = function (models) {
    Comments.belongsTo(models.candidateDetails, {
      foreignKey: "candidateId",
    });
    Comments.belongsTo(models.User, {
      foreignKey: "userId",
    });
  };
  return Comments;
};
