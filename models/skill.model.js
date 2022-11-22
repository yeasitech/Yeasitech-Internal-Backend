module.exports = (sequelize, DataTypes) => {
  const Skills = sequelize.define("Skills", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      onDelete: "cascade",
      onUpdate: "cascade",
    },
    skill: DataTypes.STRING,
  });
  Skills.associate = function (models) {
    Skills.hasMany(models.CandidateSkill, {
      foreignKey: "skillId",
    });
  };
  return Skills;
};
