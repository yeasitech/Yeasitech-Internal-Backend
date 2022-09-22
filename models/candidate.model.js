module.exports = (sequelize, DataTypes) => {
  const candidateDetails = sequelize.define("candidateDetails", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoincrement: true,
    },
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    cv: DataTypes.STRING,
    followUpDate: DataTypes.DATEONLY,
    Schedule: DataTypes.DATE,
    interviewAssignBy: DataTypes.STRING,
    text: DataTypes.TEXT,
  });
  return candidateDetails;
};
