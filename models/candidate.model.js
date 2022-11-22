module.exports = (sequelize, DataTypes) => {
  const candidateDetails = sequelize.define("candidateDetails", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    cv: DataTypes.STRING,
    followUpDate: { type: DataTypes.DATEONLY, allowNull: true },
    contactNumber: DataTypes.STRING,
    interviewSchedule: DataTypes.BOOLEAN,
    isSelected: DataTypes.BOOLEAN,
  });
  candidateDetails.associate = function (models) {
    candidateDetails.hasMany(models.Interview, {
      foreignKey: "candidateId",
    });
    candidateDetails.hasMany(models.Comments, {
      foreignKey: "candidateId",
    });
    candidateDetails.hasMany(models.CandidateSkill, {
      foreignKey: "candidateId",
    });
  };
  return candidateDetails;
};
