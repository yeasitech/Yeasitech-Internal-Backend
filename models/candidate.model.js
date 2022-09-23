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
    followUpDate: DataTypes.DATEONLY,
    schedule: DataTypes.DATE,
    interviewAssignBy: DataTypes.STRING,
    userId: DataTypes.UUID,
    // text: DataTypes.TEXT,
  });
  return candidateDetails;
};
