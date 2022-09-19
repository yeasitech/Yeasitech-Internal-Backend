const db = require("../models/index");
const { User, AssetModel } = require("../models/index");

exports.createAssets = async (request, response) => {
  const userId = request.params.userId;
  console.log(userId);
  const userData = await User.findByPk(userId);
  data = request.body;
  try {
    if (!userData || userData.length < 0) {
      response.status(500).json({ ack: 0, msg: `invalid userId ` });
    } else {
      const createAsset = await AssetModel.create({ ...data, userId: userId });
      response
        .status(200)
        .json({ ack: 1, msg: "successfully created", data: createAsset });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};
