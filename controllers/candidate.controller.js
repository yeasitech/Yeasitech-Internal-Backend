const {
  candidateDetails,
  User,
  Comments,
  Interview,
  CandidateSkill,
  Skills,
  Department,
} = require("../models");
const { Op } = require("sequelize");

const candidateSkillModel = require("../models/candidateSkill.model");
const { departmentRouter } = require("../routes/user.router");
//create Candidate
exports.createCandidate = async (request, response) => {
  const user = request.body;
  // const candidateInfo = {
  //   fullName: user.fullName,
  //   email: user.email,
  //   followUpDate: user.followUpDate,
  //   cv: user.cv,
  //   skills: user.skills,
  //   contactNumber: user.contactNumber,
  //   interviewSchedule: false,
  //   isSelected: false,
  // };

  try {
    const departmentData = await Department.findByPk(
      user.candidateInfo.departmentId
    );
    if (!departmentData) {
      return response
        .status(200)
        .json({ ack: 0, msg: "No Department available" });
    } else {
      const createCandidate = await candidateDetails.create({
        ...user.candidateInfo,
      });
      await Promise.all([
        user.skillIds.map(async (value) => {
          await CandidateSkill.create({
            skillId: value.id,
            candidateId: createCandidate.id,
          });
        }),
      ]);
      response.status(200).json({ ack: 1, data: createCandidate });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `server error` });
  }
};

// Candiadte Update
exports.candidateUpdate = async (request, response) => {
  const id = request.params.id;
  const { candidateInfo } = request.body;
  const searchData = await candidateDetails.findByPk(id);
  try {
    if (!searchData) {
      response.status(500).json({ ack: 0, msg: `invalid id passed ` });
    } else {
      const updatedData = await candidateDetails.update(
        { ...candidateInfo },
        {
          where: { id: id },
        }
      );
      const deleteCandiadteSkills = await CandidateSkill.destroy({
        where: { candidateId: id },
      });
      await Promise.all(
        request.body.skillIds.map(async (value) => {
          await CandidateSkill.create({ candidateId: id, skillId: value.id });
        })
      );
      response
        .status(200)
        .json({ ack: 1, msg: `Candidate updated successfully` });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

// Delete Candidate
exports.deleteCandidate = async (request, response) => {
  const id = request.params.id;
  const candidateData = await candidateDetails.findByPk(id);

  try {
    if (!candidateData || candidateData.length < 0) {
      return response.status(500).json({ ack: 0, msg: `invalid candidate id` });
    } else {
      const [data] = await Promise.all([
        candidateDetails.destroy({
          where: { id },
        }),
        Comments.destroy({
          where: { candidateId: id },
        }),
        Interview.destroy({
          where: { candidateId: id },
        }),

        response
          .status(200)
          .json({ ack: 1, data: ` data deleted successfully` }),
      ]).catch((error) => {});
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

// Candidate Pagination
exports.candidatePagination = async (request, response) => {
  const {
    elements,
    page,
    searchParam = "",
    searchBySkillId = "",
    searchByExperience = "",
    fromDate,
    toDate,
  } = request.query;
  const limit = parseInt(elements);
  const offset = parseInt(limit * (page - 1));
  let where = {};
  if (searchBySkillId) {
    where = {
      skillId: { [Op.eq]: `${searchBySkillId}` },
    };
  }
  try {
    const { count, rows } = await candidateDetails.findAndCountAll({
      //order: [["followUpDate", "DESc"]],
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: {
        [Op.or]: [
          { fullName: { [Op.like]: `%${searchParam}%` } },
          { email: { [Op.like]: `%${searchParam}%` } },
          { contactNumber: { [Op.like]: `%${searchParam}%` } },
          //{ yearsOfExperience: { [Op.eq]: `${searchByExperience}` } },
        ],
        // followUpDate: {
        //   [Op.and]: {
        //     [Op.gte]: fromDate,
        //     [Op.lte]: toDate,
        //   },
        // },
      },
      include: [
        { model: Comments },
        { model: Department, attributes: ["id", "department"] },
        {
          model: CandidateSkill,
          where,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: {
            model: Skills,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        },
      ],
      ...(searchByExperience && {
        where: { yearsOfExperience: { [Op.eq]: `${searchByExperience}` } },
      }),

      limit,
      offset,
    });

    response.status(200).json({
      ack: 1,
      data: rows,
      elementPerPage: rows.length,
      totalData: count,
      totalpage: Math.ceil(count / elements),
      page: parseInt(page),
      elementsPerPage: limit,
    });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

//Get Candidate
exports.getCandidate = async (request, response) => {
  const candidateId = request.params.candidateId;
  const candidateData = await candidateDetails.findByPk(candidateId);
  const commentData = await Comments.findOne({
    where: { candidateId: candidateId },
  });
  try {
    if (!candidateData && candidateData == null) {
      return response.status(500).json({ ack: 0, msg: `invalid candidateId` });
    } else {
      const data = await candidateDetails.findOne({
        where: { id: candidateId },
        include: { model: Comments },
      });
      response.status(200).json({ ack: 1, data: data });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

exports.getSingleCandidate = async (request, response) => {
  const candidateId = request.params.candidateId;
  try {
    const data = await candidateDetails.findByPk(candidateId);
    response.status(200).json({ ack: 1, data: data });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

//create interview
exports.createInterview = async (request, response) => {
  const candidateId = request.params.candidateId;
  const user = request.body;

  const candidateData = await candidateDetails.findByPk(candidateId);
  const userId = request.userId;
  const info = {
    schedule: user.schedule,
    interviewAssignTo: user.interviewAssignTo,
    interviewAssignBy: userId,
    candidateId: candidateId,
  };
  try {
    if (!candidateData && candidateData == null) {
      return response.status(500).json({ ack: 0, msg: `invalid candidateId` });
    } else {
      interviewData = await Interview.create(info);
      response.status(200).json({ ack: 1, data: interviewData });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

// Update Interview

exports.updateInterview = async (request, response) => {
  const interviewId = request.params.interviewId;
  const userId = request.userId;
  const data = {
    schedule: request.body.schedule,
    interviewAssignBy: userId,
    candidateId: request.body.candidateId,
    interviewAssignTo: request.body.interviewAssignTo,
  };

  const interviewData = await Interview.findByPk(interviewId);
  try {
    if (!interviewData || interviewData == null) {
      return response.status(500).json({ ack: 0, msg: `invalid interview id` });
    } else {
      const updatedData = await Interview.update(data, {
        where: { id: interviewId },
      });
      response
        .status(200)
        .json({ ack: 1, msg: `interview updated successfully` });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `server error` });
  }
};

// delete Interview

exports.deleteInterview = async (request, response) => {
  const interviewId = request.params.interviewId;

  const interviewData = await Interview.findByPk(interviewId);

  try {
    if (!interviewData || interviewData == null) {
      response
        .status(500)
        .json({ ack: 0, msg: `please give valid interview id` });
    } else {
      const interviewToDelete = await Interview.destroy({
        where: { id: interviewId },
      });
      response
        .status(200)
        .json({ ack: 1, msg: `interview deleted successfully` });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

//interview pagiantion
exports.interviewPagination = async (request, response) => {
  const { elements, page, searchParam, searchByDate = "" } = request.query;
  const limit = parseInt(elements);
  const offset = parseInt(limit * (page - 1));
  let where = {};
  if (searchParam) {
    where = {
      [Op.or]: [
        {
          "$InterviewAssignedTo.firstName$": {
            [Op.like]: `%${searchParam}%`,
          },
        },
        {
          "$InterviewAssignedBy.firstName$": {
            [Op.like]: `%${searchParam}%`,
          },
        },
      ],
    };
  }
  if (searchByDate) {
    where = {
      schedule: { [Op.eq]: `%${searchByDate}%` },
    };
  }
  try {
    const { count, rows } = await Interview.findAndCountAll({
      //order: [["followUpDate", "DESc"]],
      where,
      include: [
        {
          model: User,
          as: "InterviewAssignedTo",
          attributes: ["firstName", "middleName", "lastName"],
        },
        {
          model: User,
          as: "InterviewAssignedBy",
          attributes: ["firstName", "middleName", "lastName"],
        },
        { model: candidateDetails, attributes: ["fullname"] },
      ],
      // ...(searchByDate && {
      //   where: {
      //     //  [Op.or]: [
      //     // { interviewAssignBy: { [Op.like]: `%${searchParam}%` } },
      //     // { interviewAssignTo: { [Op.like]: `%${searchParam}%` } },
      //     schedule: { [Op.eq]: `%${searchByDate}%` },
      //     //],
      //   },
      // }),
      limit,
      offset,
    });
    response.status(200).json({
      ack: 1,
      data: rows,
      elementPerPage: rows.length,
      totalData: count,
      totalpage: Math.ceil(count / elements),
      page: parseInt(page),
      elementsPerPage: limit,
    });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

// schedule of candiadate Interview
exports.getInterviewByCandidate = async (request, response) => {
  const candidateId = request.params.candidateId;
  try {
    if (!candidateId) {
      response
        .status(500)
        .json({ ack: 0, msg: `please give valid candidate id` });
    }
    const interviewData = await Interview.findAll({
      where: { candidateId: candidateId },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: User,
          as: "InterviewAssignedTo",
          attributes: ["firstName", "middleName", "lastName"],
        },
        {
          model: User,
          as: "InterviewAssignedBy",
          attributes: ["firstName", "middleName", "lastName"],
        },
        { model: candidateDetails, attributes: ["fullname"] },
      ],
    });
    if (interviewData.length <= 0) {
      response.status(500).json({ ack: 0, msg: `No Interview Details` });
    } else {
      response.status(200).json({ ack: 0, data: interviewData });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};
