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
    contactNumber: DataTypes.STRING,
    //schedule: DataTypes.DATEONLY,
    //interviewAssignBy: DataTypes.STRING,
    skills: DataTypes.TEXT,
    interviewSchedule: DataTypes.BOOLEAN,
    isSelected: DataTypes.BOOLEAN,
    // userId: DataTypes.UUID,
    // text: DataTypes.TEXT,
  });
  return candidateDetails;
};
