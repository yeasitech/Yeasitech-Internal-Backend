const { candidateDetails, User, Comments, Interview } = require("../models");
const { Op } = require("sequelize");
//create Candidate
exports.createCandidate = async (request, response) => {
  const user = request.body;
  const candidateInfo = {
    fullName: user.fullName,
    email: user.email,
    followUpDate: user.followUpDate,
    cv: user.cv,
    skills: user.skills,
    contactNumber: user.contactNumber,
    interviewSchedule: false,
    isSelected: false,
  };
  try {
    const candidate = await candidateDetails.create(candidateInfo);

    // const { comment } = user;
    // const commentCreate = { comment: user.comment, candidateId };
    // const commentRes = await Comments.create(commentCreate);

    response.status(200).json({ ack: 1, data: candidate });
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
    if (!searchData || searchData.length < 0) {
      response.status(500).json({ ack: 0, msg: `invalid id passed ` });
    } else {
      const updatedData = await candidateDetails.update(
        { ...candidateInfo },
        {
          where: { id: id },
        }
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
  const { elements, page, searchParam = "" } = request.query;
  const limit = parseInt(elements);
  const offset = parseInt(limit * (page - 1));
  try {
    const { count, rows } = await candidateDetails.findAndCountAll({
      //order: [["followUpDate", "DESc"]],
      include: { model: Comments },
      where: {
        [Op.or]: [
          { fullName: { [Op.like]: `%${searchParam}%` } },
          { email: { [Op.like]: `%${searchParam}%` } },
          { contactNumber: { [Op.like]: `%${searchParam}%` } },
          { skills: { [Op.like]: "%" + searchParam + "%" } },
        ],
      },
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
  const { elements, page, searchParam = "" } = request.query;
  const limit = parseInt(elements);
  const offset = parseInt(limit * (page - 1));
  try {
    const { count, rows } = await Interview.findAndCountAll({
      //order: [["followUpDate", "DESc"]],
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
      ],
      // where: {
      //   [Op.or]: [
      //     { fullName: { [Op.like]: `%${searchParam}%` } },
      //     { email: { [Op.like]: `%${searchParam}%` } },
      //     { contactNumber: { [Op.like]: `%${searchParam}%` } },
      //     { skills: { [Op.like]: "%" + searchParam + "%" } },
      //   ],
      // },
      ...(searchParam && {
        where: {
          schedule: { [Op.eq]: `%${searchParam}%` },
        },
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
