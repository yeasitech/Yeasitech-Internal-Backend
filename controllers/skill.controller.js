const { candidateDetails, Skills, CandidateSkill } = require("../models");
const { Op } = require("sequelize");
//create Candidate
exports.createSkill = async (request, response) => {
  const skillData = request.body;

  try {
    const data = await Skills.create(skillData);

    response
      .status(200)
      .json({ ack: 1, msg: `skill created successfully`, data: data });
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
    const candidateSkillData = await CandidateSkill.findAll({
      where: { skillId: id },
    });
    if (!id) {
      return response.status(500).json({ ack: 0, msg: `No id Found` });
    }
    if (!skillData) {
      return response.status(500).json({ ack: 0, msg: `No skill data Found` });
    }
    if (skillData) {
      if (!candidateSkillData.length) {
        let data = await Skills.destroy({ where: { id: id } });
        response
          .status(200)
          .json({ ack: 1, msg: ` Skill deleted Successfully`, data: data });
      } else {
        await CandidateSkill.destroy({ where: { skillId: id } });
        let data = await Skills.destroy({ where: { id: id } });
        response
          .status(200)
          .json({ ack: 1, msg: ` Skill deleted Successfully`, data: data });
      }
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
      response.status(200).json({
        ack: 1,
        msg: ` Skill updated Successfully`,
        data: updateSkill,
      });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `server error` });
  }
};

//skill pagination
exports.skillPagination = async (request, response) => {
  const { elements, page } = request.query;
  const limit = parseInt(elements);
  const offset = parseInt(limit * (page - 1));

  try {
    const { count, rows } = await Skills.findAndCountAll({
      limit,
      offset,
      //order: [["createdAt", "AESC"]],
    });
    response.status(200).json({
      ack: 1,
      data: rows,
      elementCount: rows.length,
      totalElements: count,
      totalpage: Math.ceil(count / elements),
      page: parseInt(page),
      elementsPerPage: limit,
    });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};
