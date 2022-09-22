const { CandidateModel } = require("../models/candidate.model");

exports.createCandidate = async (request, response) => {
  const newCandidate = await CandidateModel.create(request.body);
  response.status(200).json({ msg: newCandidate });
};
