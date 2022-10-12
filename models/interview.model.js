module.exports = (sequelize, DataTypes) => {
  const Interview = sequelize.define("Interview", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      onDelete: "cascade",
      onUpdate: "cascade",
    },
    schedule: DataTypes.DATEONLY,
    interviewAssignTo: DataTypes.UUID,
    interviewAssignBy: DataTypes.UUID,
    candidateId: DataTypes.INTEGER,
    // userId: DataTypes.UUID,
  });
  Interview.associate = function (models) {
    Interview.belongsTo(models.User, {
      foreignKey: "interviewAssignTo",
      as: "InterviewAssignedTo",
    });
    Interview.belongsTo(models.User, {
      foreignKey: "interviewAssignBy",
      as: "InterviewAssignedBy",
    });
    Interview.belongsTo(models.candidateDetails, {
      foreignKey: "candidateId",
    });
  };
  return Interview;
};
