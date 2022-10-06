const {
  CandidateModel,
  User,
  CommentModel,
  InterviewModel,
} = require("../models/index");
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
    const candidate = await CandidateModel.create(candidateInfo);

    // const { comment } = user;
    // const commentCreate = { comment: user.comment, candidateId };
    // const commentRes = await CommentModel.create(commentCreate);

    response.status(200).json({ ack: 1, data: candidate });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `server error` });
  }
};

// Candiadte Update
exports.candidateUpdate = async (request, response) => {
  const id = request.params.id;
  const { candidateInfo } = request.body;
  const searchData = await CandidateModel.findByPk(id);
  try {
    if (!searchData || searchData.length < 0) {
      response.status(500).json({ ack: 0, msg: `invalid id passed ` });
    } else {
      const updatedData = await CandidateModel.update(
        { ...candidateInfo },
        {
          where: { id: id },
        }
      );
      response.status(200).json({ ack: 1, msg: updatedData });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

// Delete Candidate
exports.deleteCandidate = async (request, response) => {
  const id = request.params.id;
  const candidateData = await CandidateModel.findByPk(id);
  try {
    if (!candidateData || candidateData.length < 0) {
      return response.status(500).json({ ack: 0, msg: `invalid candidate id` });
    } else {
      const candidateToDelete = await CandidateModel.destroy({
        where: { id },
      });
      response.status(200).json({ ack: 1, msg: `deleted successfully ` });
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
    searchName = "",
    searchEmail = "",
    searchContactNumber = "",
    searchSkills = "",
  } = request.query;
  const limit = parseInt(elements);
  const offset = parseInt(limit * (page - 1));
  console.log(`offset`, offset);
  try {
    const { count, rows } = await CandidateModel.findAndCountAll({
      //order: [["followUpDate", "DESc"]],
      include: { model: CommentModel },
      where: {
        [Op.or]: [
          { fullName: { [Op.like]: `%${searchName}%` } },
          { email: { [Op.like]: `%${searchEmail}%` } },
          { contactNumber: { [Op.like]: `%${searchContactNumber}%` } },
          { skills: { [Op.like]: "%" + searchSkills + "%" } },
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
  const candidateData = await CandidateModel.findByPk(candidateId);
  const commentData = await CommentModel.findOne({
    where: { candidateId: candidateId },
  });
  try {
    if (!candidateData && candidateData == null) {
      return response.status(500).json({ ack: 0, msg: `invalid candidateId` });
    } else {
      const data = await CandidateModel.findOne({
        where: { id: candidateId },
        include: { model: CommentModel },
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
    const data = await CandidateModel.findByPk(candidateId);
    response.status(200).json({ ack: 1, data: data });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

exports.createInterview = async (request, response) => {
  const candidateId = request.params.candidateId;
  const user = request.body;

  const candidateData = await CandidateModel.findByPk(candidateId);
  const info = {
    schedule: user.schedule,
    interviewAssignBy: user.interviewAssignBy,
    userId: user.userId,
    candidateId: request.params.candidateId,
  };

  try {
    if (!candidateData && candidateData == null) {
      return response.status(500).json({ ack: 0, msg: `invalid candidateId` });
    } else {
      interviewData = await InterviewModel.create(info);
      response.status(200).json({ ack: 1, data: interviewData });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};
