const { CandidateModel, CommentModel } = require("../models/index");

exports.createComment = async (request, response) => {
  const candidateId = request.params.candidateId;
  const candidateData = await CandidateModel.findByPk(id);
  const data = request.body;
  try {
    if (!candidateData && candidateData.length < 0) {
      return response
        .status(500)
        .json({ ack: 0, msg: `invalid candidate id ` });
    } else {
      const createComment = await CommentModel.create(data, candidateId);
      response.status(200).json({ ack: 1, data: createComment });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `server error` });
  }
};
