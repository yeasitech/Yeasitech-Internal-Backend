const { User, AssetModel } = require("../models/index");
const { Op } = require("sequelize");
exports.createAssets = async (request, response) => {
  data = request.body;
  const userId = data.userId;
  console.log(userId);
  const userData = await User.findByPk(userId);

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
  const {
    elements,
    page,
    searcProductId = "",
    searchAssetId = "",
    searchType = "",
  } = request.query;
  const limit = parseInt(elements);
  console.log(`qwertyui`, limit);
  const offset = parseInt(limit * (page - 1));
  try {
    const { count, rows: asset } = await AssetModel.findAndCountAll({
      include: [{ model: User }],
      where: {
        [Op.or]: [
          { type: { [Op.like]: `%${searchType}%` } },
          { assetId: { [Op.like]: `%${searchAssetId}%` } },
          { productId: { [Op.like]: `%${searcProductId}%` } },
        ],
      },
      limit,
      offset,

      //order: [["createdAt", "AESC"]],
    });
    // console.log(`qwertyu`, count, asset);
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

exports.getSingleAsset = async (request, response) => {
  assetId = request.params.assetId;
  try {
    const data = await AssetModel.findByPk(assetId);
    response.status(200).json({ ack: 1, msg: data });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};
