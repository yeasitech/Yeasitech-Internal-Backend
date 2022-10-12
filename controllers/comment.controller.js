const { candidateDetails, Comments, User } = require("../models");

exports.createComment = async (request, response) => {
  const candidateId = request.params.candidateId;
  const candidateData = await candidateDetails.findByPk(candidateId);
  const userId = request.userId;
  const user = request.body;
  const data = {
    comment: user.comment,
    candidateId: candidateId,
    userId: userId,
  };
  try {
    if (!candidateData && candidateData == null) {
      return response.status(500).json({ ack: 0, msg: `invalid candidate id` });
    } else {
      const createComment = await Comments.create(data);
      response.status(200).json({ ack: 1, data: createComment });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `server error` });
  }
};

exports.getComment = async (request, response) => {
  const candidateId = request.params.candidateId;

  const candidateData = await candidateDetails.findByPk(candidateId);
  try {
    if (!candidateData && candidateData == null) {
      return response.status(500).json({ ack: 0, msg: `invalid candidate id` });
    } else {
      const createComment = await Comments.findAll({
        include: [
          { model: candidateDetails },
          {
            model: User,
            attributes: ["firstName", "middleName", "lastName"],
          },
        ],
        where: { candidateId: candidateId },
      });
      response.status(200).json({ ack: 1, data: createComment });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `server error` });
  }
};
exports.updateComments = async (request, response) => {
  // const id = request.params.id;

  const { candidateId } = request.body;
  const commentData = await Comments.findOne({
    where: { candidateId: candidateId },
  });
  const candidateData = await Comments.findOne({
    where: { id: candidateId },
  });

  try {
    if (!commentData || commentData.length < 0) {
      return response
        .status(500)
        .json({ ack: 0, msg: `invalid comment or candidate id` });
    } else {
      const updatedData = await Comments.create(request.body, {
        where: { candidateId },
      });
      response
        .status(200)
        .json({ ack: 1, data: `comment updated successfully` });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `server error` });
  }
};
