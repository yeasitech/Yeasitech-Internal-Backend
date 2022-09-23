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

exports.getAssetsPagination = async (request, response) => {
  const { elements, page } = request.query;
  const limit = parseInt(elements);
  console.log(`qwertyui`, limit);
  const offset = parseInt(limit * (page - 1));
  try {
    const { count, rows: asset } = await AssetModel.findAndCountAll({
      include: [{ model: User }],
      limit,
      offset,
      //order: [["createdAt", "AESC"]],
    });
    console.log(`qwertyu`, count, asset);
    response.status(200).json({
      ack: 1,
      data: asset,
      elementCount: asset.length,
      totalElements: count,
      totalpage: Math.ceil(count / elements),
      page: parseInt(page),
      elementsPerPage: limit,
    });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

exports.updateAsset = async (request, response) => {
  const id = request.params.id;
  const { updateAsset } = request.body;

  try {
    if (!updateAsset || updateAsset.length < 0) {
      response.status(500).json({ ack: 0, msg: `invalid input ` });
    }

    const assets = await AssetModel.update(updateAsset, { where: { id: id } });
    response.status(200).json({ ack: 1, msg: `asset updated successfully` });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

exports.deleteAsset = async (request, response) => {
  const id = request.params.id;

  const assetData = await AssetModel.findByPk(id);

  try {
    if (!assetData || assetData.length < 0) {
      response.status(500).json({ ack: 0, msg: `please give valid asset id` });
    } else {
      const assetToDelete = await AssetModel.destroy({
        where: { id },
      });
      response.status(200).json({ ack: 1, msg: `asset deleted successfully` });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};
