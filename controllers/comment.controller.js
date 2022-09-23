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
        include: [{ model: CandidateModel }],
        where: { candidateId: candidateId },
      });
      response.status(200).json({ ack: 1, data: createComment });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `server error` });
  }
};
