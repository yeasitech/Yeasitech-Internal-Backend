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
    interviewSchedule: { type: DataTypes.DATEONLY, allowNull: true },
    isSelected: DataTypes.BOOLEAN,
    departmentId: DataTypes.INTEGER,
    yearsOfExperience: DataTypes.INTEGER,
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
    candidateDetails.belongsTo(models.Department, {
      foreignKey: "departmentId",
    });
  };
  return candidateDetails;
};
