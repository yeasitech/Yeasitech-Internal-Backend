module.exports = (sequelize, DataTypes) => {
  const Interview = sequelize.define("Interview", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    schedule: DataTypes.DATEONLY,
    interviewAssignBy: DataTypes.STRING,
    candidateId: DataTypes.INTEGER,
    userId: DataTypes.UUID,
  });
  return Interview;
};
