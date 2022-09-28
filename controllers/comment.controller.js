const { CandidateModel, CommentModel } = require("../models/index");

exports.createComment = async (request, response) => {
  const candidateId = request.params.candidateId;
  const candidateData = await CandidateModel.findByPk(candidateId);

  const user = request.body;
  const data = { comment: user.comment, candidateId: candidateId };
  try {
    if (!candidateData && candidateData == null) {
      return response.status(500).json({ ack: 0, msg: `invalid candidate id` });
    } else {
      const createComment = await CommentModel.create(data);
      response.status(200).json({ ack: 1, data: createComment });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `server error` });
  }
};

exports.getComment = async (request, response) => {
  const candidateId = request.params.candidateId;
  const candidateData = await CandidateModel.findByPk(candidateId);
  try {
    if (!candidateData && candidateData == null) {
      return response.status(500).json({ ack: 0, msg: `invalid candidate id` });
    } else {
      const createComment = await CommentModel.findOne({
        include: { model: CandidateModel },
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
  // console.log(id);
  const { candidateId } = request.body;
  const commentData = await CommentModel.findOne({
    where: { candidateId: candidateId },
  });
  const candidateData = await CommentModel.findOne({
    where: { id: candidateId },
  });

  try {
    if (!commentData || commentData.length < 0) {
      return response
        .status(500)
        .json({ ack: 0, msg: `invalid comment or candidate id` });
    } else {
      const updatedData = await CommentModel.create(request.body, {
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
