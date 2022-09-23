const {
  CandidateModel,
  User,
  CommentModel0,
  CommentModel,
} = require("../models/index");

exports.createCandidate = async (request, response) => {
  const userId = request.params.userId;
  const data = await User.findByPk(userId);
  // console.log(`q  werghujkl`, data);
  const user = request.body;
  const candidateInfo = {
    fullName: user.fullName,
    email: user.email,
    followUpDate: user.followUpDate,
    cv: user.cv,
    schedule: user.schedule,
    interviewAssignBy: user.interviewAssignBy,
    userId: userId,
  };
  try {
    const candidate = await CandidateModel.create(candidateInfo);
    response.status(200).json({ ack: 1, data: candidate });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `server error` });
  }
};
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

exports.candidatePagination = async (request, response) => {
  const { elements, page } = request.query;
  const limit = parseInt(elements);
  const offset = parseInt(limit * (page - 1));
  console.log(`offset`, offset);
  try {
    const { count, rows } = await CandidateModel.findAndCountAll({
      include: [{ model: CommentModel }],
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
