module.exports = (sequelize, DataTypes) => {
  const education = sequelize.define("education", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    schoolName: DataTypes.STRING,
    secondaryPercentage: DataTypes.INTEGER,
    secondaryPassoutYear: DataTypes.INTEGER,
    higherSecondarySpecialization: DataTypes.STRING,
    higherSecondaryPercentage: DataTypes.INTEGER,
    higherSecondaryPassoutYear: DataTypes.INTEGER,
    diplomaCollegeName: DataTypes.STRING,
    diplomaSpecialation: DataTypes.STRING,
    diplomaPassoutYear: DataTypes.STRING,
    graduationCollegeName: DataTypes.STRING,
    graduationSpecialization: DataTypes.STRING,
    graduationpercentage: DataTypes.INTEGER,
    graduationPassout: DataTypes.INTEGER,
    mastersCollegeName: DataTypes.STRING,
    mastersSpecialization: DataTypes.STRING,
    masterspercentage: DataTypes.INTEGER,
  });
  return education;
};
