const { candidateDetails, Skills, CandidateSkill } = require("../models");
const { Op } = require("sequelize");
//create Candidate
exports.createSkill = async (request, response) => {
  const skillData = request.body;

  try {
    const data = await Skills.create(skillData);

    response.status(200).json({ ack: 1, data: data });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `server error` });
  }
};

exports.getSkills = async (request, response) => {
  try {
    const allSkill = await Skills.findAll();
    if (!allSkill) {
      return response.status(500).json({ ack: 0, msg: `No Data Found` });
    } else {
      response.status(200).json({ ack: 1, data: allSkill });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `server error` });
  }
};
exports.deleteSkills = async (request, response) => {
  const id = request.params.id;
  try {
    const skillData = await Skills.findByPk(id);
    const cabdidateSkillData = await CandidateSkill.findAll({
      where: { skillId: id },
    });
    if (!id || !skillData || cabdidateSkillData.length <= 0) {
      return response.status(500).json({ ack: 0, msg: `No id Found` });
    } else {
      const [data] = await Promise.all([
        CandidateSkill.destroy({ where: { skillId: id } }),
        Skills.destroy({ where: { id: id } }),
      ]);
      response
        .status(200)
        .json({ ack: 1, msg: ` Skill deleted Successfully`, data: data });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `server error` });
  }
};

exports.editSkills = async (request, response) => {
  const id = request.params.id;
  try {
    const skillData = await Skills.findByPk(id);

    if (!id || !skillData) {
      return response.status(500).json({ ack: 0, msg: `No id Found` });
    } else {
      const updateSkill = await Skills.update(
        { skill: request.body.skill },
        { where: { id: id } }
      );
      response
        .status(200)
        .json({
          ack: 1,
          msg: ` Skill updated Successfully`,
          data: updateSkill,
        });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `server error` });
  }
};
