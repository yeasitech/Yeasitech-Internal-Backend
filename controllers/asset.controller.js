const { User, Assets } = require("../models");
const { Op } = require("sequelize");

exports.createAssets = async (request, response) => {
  data = request.body;
  const userId = request.userId;
  const userData = await User.findOne({
    where: { id: userId },
    attributes: [
      "firstName",
      "middleName",
      "lastName",
      "id",
      "email",
      "dateOfJoining",
      "employeeType",
      "onBoardingStatus",
      "isAdmin",
      "isActive",
    ],
  });
  try {
    if (!userData || userData.length < 0) {
      response.status(500).json({ ack: 0, msg: `invalid userId ` });
    } else {
      const createAsset = await Assets.create({ ...data });
      response.status(200).json({
        ack: 1,
        msg: "successfully created",
        data: createAsset,
        userData,
      });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

exports.getAssetsPagination = async (request, response) => {
  const { elements, page, searchType = "" } = request.query;
  const limit = parseInt(elements);
  const offset = parseInt(limit * (page - 1));
  try {
    const { count, rows: asset } = await Assets.findAndCountAll({
      include: [
        {
          model: User,
          attributes: [
            "firstName",
            "middleName",
            "lastName",
            "id",
            "email",
            "dateOfJoining",
            "employeeType",
            "onBoardingStatus",
            "isAdmin",
            "isActive",
          ],
        },
      ],
      where: {
        [Op.or]: [
          { type: { [Op.like]: `%${searchType}%` } },
          { assetId: { [Op.like]: `%${searchType}%` } },
          { productId: { [Op.like]: `%${searchType}%` } },
        ],
      },
      limit,
      offset,

      //order: [["createdAt", "AESC"]],
    });

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

    const assets = await Assets.update(updateAsset, { where: { id: id } });
    response.status(200).json({ ack: 1, msg: `asset updated successfully` });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

exports.deleteAsset = async (request, response) => {
  const id = request.params.id;

  const assetData = await Assets.findByPk(id);

  try {
    if (!assetData || assetData.length < 0) {
      response.status(500).json({ ack: 0, msg: `please give valid asset id` });
    } else {
      const assetToDelete = await Assets.destroy({
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
    const data = await Assets.findByPk(assetId);
    response.status(200).json({ ack: 1, data: data });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};
