module.exports = (sequelize, DataTypes) => {
  const CandidateSkill = sequelize.define("CandidateSkill", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      onDelete: "cascade",
      onUpdate: "cascade",
    },
    skillId: DataTypes.INTEGER,
    candidateId: DataTypes.INTEGER,
  });
  CandidateSkill.associate = function (models) {
    CandidateSkill.belongsTo(models.candidateDetails, {
      foreignKey: "candidateId",
    });
    CandidateSkill.belongsTo(models.Skills, {
      foreignKey: "skillId",
    });
  };
  return CandidateSkill;
};
