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
  return Interview;
};
