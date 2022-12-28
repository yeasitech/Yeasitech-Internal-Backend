const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { clientDetails } = require("../models");
const {
  createClientSchema,
  updateClientSchema,
} = require("./validation/client.validation");

exports.createClient = async (request, response) => {
  const { error } = createClientSchema.validate(request.body);

  if (error) {
    return response.status(200).json({ ack: 0, msg: error.details[0].message });
  }
  const client = request.body;
  if (!client)
    return response
      .status(200)
      .json({ ack: 1, msg: `Please provide valid client` });

  try {
    const checkForIfExists = await clientDetails.findOne({
      where: { email: request.body.email },
    });

    if (checkForIfExists) {
      response.status(200).json({
        ack: 0,
        msg: "Client exists with this email",
      });
    } else {
      const clientRecord = {
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone,
        clientId: client.clientId,
        companyName: client.companyName,
        birthday: client.birthday,
        gender: client.gender,
        address: client.address,
        profileImage: client.profileImage,
        contactPerson: client.contactPerson,
        designation: client.designation,
        isActive: true,
      };

      const clientData = await clientDetails.create({
        ...clientRecord,
      });
      response
        .status(200)
        .json({ ack: 1, msg: "Client successfully created", data: clientData });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || "Server error" });
  }
};

exports.editClient = async (request, response) => {
  const id = request.params.id;
  const { error } = updateClientSchema.validate(request.body);
  if (error) {
    return response.status(200).json({ ack: 0, msg: error.details[0].message });
  }
  try {
    const client = request.body;
    const data = await clientDetails.findByPk(id);
    if (!data) {
      return response
        .status(200)
        .json({ ack: 1, msg: `Please provide valid id` });
    } else {
      const clientData = await clientDetails.update(
        { ...client },
        { where: { id } }
      );
      response
        .status(200)
        .json({ ack: 1, msg: "Client successfully updated", data: clientData });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || "Server error" });
  }
};

exports.clientList = async (request, response) => {
  const {
    elements,
    page,
    searchByName = "",
    searchByDesignation = "",
    searchByClientId = "",
  } = request.query;
  const limit = parseInt(elements);
  const offset = parseInt(limit * (page - 1));
  console.log(searchByName);
  try {
    const { count, rows } = await clientDetails.findAndCountAll({
      order: [["id", "ASC"]],
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: { firstName: { [Op.like]: `%${searchByName}%` } },
      ...(searchByDesignation && {
        where: { designation: { [Op.like]: `%${searchByDesignation}%` } },
      }),
      ...(searchByClientId && {
        where: { clientId: { [Op.like]: `%${searchByClientId}%` } },
      }),

      limit,
      offset,
    });
    response.status(200).json({
      ack: 1,
      data: rows,
      elementPerPage: rows.length,
      totalpage: Math.ceil(count / elements),
      page: parseInt(page),
      elementsPerPage: limit,
    });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};
//single client
exports.getSingleClient = async (request, response) => {
  const id = request.params.id;
  try {
    const clientData = await clientDetails.findByPk(id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (!id || id == null) {
      return response.status(500).json({ ack: 0, msg: `invalid Id` });
    } else if (!clientData) {
      return response.status(500).json({ ack: 0, msg: `No data found` });
    } else {
      return response.status(200).json({ ack: 0, data: clientData });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};
//delete client
exports.deleteClient = async (request, response) => {
  const id = request.params.id;
  try {
    const clientData = await clientDetails.findByPk(id);

    if (!clientData) {
      return response.status(500).json({ ack: 0, msg: ` No data found` });
    } else {
      const deletedData = await clientDetails.destroy({ where: { id } });
      return response.status(200).json({
        ack: 0,
        data: deletedData,
        msg: `Client deleted successfully`,
      });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};
