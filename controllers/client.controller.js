const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { clientDetails, clientInvoice } = require("../models");
const {
  createClientSchema,
  updateClientSchema,
  createClientInvoiceSchema,
  updateClientInvoiceSchema,
} = require("./validation/client.validation");
const { response } = require("express");

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
exports.allClient = async (request, response) => {
  try {
    const clientData = await clientDetails.findAll({
      attributes: ["id", "firstName", "lastName"],
    });
    if (clientData.length <= 0) {
      return response.status(500).json({
        ack: 0,
        msg: `Client Data Not Available`,
      });
    }
    return response.status(200).json({
      ack: 1,
      data: clientData,
    });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

// create client Invoice
exports.createClientInvoice = async (request, response) => {
  try {
    let body = request.body;
    const { error } = createClientInvoiceSchema.validate(
      request.body.clientData
    );
    if (error) {
      return response
        .status(200)
        .json({ ack: 0, msg: error.details[0].message });
    }
    const clientId = body.clientData.clientId;
    const clientData = await clientDetails.findByPk(clientId);
    if (!clientData)
      return response.status(500).json({
        ack: 0,
        msg: `No client data`,
      });
    else {
      const updatedClientData = await clientDetails.update(
        {
          invoiceDate: body.clientData,
          dueDate: body.clientData.dueDate,
          otherInfo: body.clientData.otherInfo,
        },
        { where: { id: clientId } }
      );
    }
    const createClientInvoice = await Promise.all(
      body.invoice.map(async (e) => {
        return await clientInvoice.create({
          item: e.item,
          unitCost: e.unitCost,
          quantity: e.quantity,
          amount: e.amount,
          clientId: clientId,
          status: "pending",
        });
      })
    );
    response.status(200).json({
      ack: 1,
      data: createClientInvoice,
    });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

//candidate invoice pagination
exports.invoiceList = async (request, response) => {
  const { elements, page } = request.query;
  const limit = parseInt(elements);
  const offset = parseInt(limit * (page - 1));
  try {
    const { count, rows } = await clientInvoice.findAndCountAll({
      order: [["id", "ASC"]],
      //attributes: { exclude: ["createdAt", "updatedAt"] },
      // where: { firstName: { [Op.like]: `%${searchByName}%` } },
      // ...(searchByDesignation && {
      //   where: { designation: { [Op.like]: `%${searchByDesignation}%` } },
      // }),
      // ...(searchByClientId && {
      //   where: { clientId: { [Op.like]: `%${searchByClientId}%` } },
      // }),

      limit,
      offset,
    });
    response.status(200).json({
      ack: 1,
      data: rows,
      elementPerPage: rows.length,
      totalElement: count,
      totalpage: Math.ceil(count / elements),
      page: parseInt(page),
      elementsPerPage: limit,
    });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

//Delete client invoice
exports.deleteClientInvoice = async (request, response) => {
  const id = request.params.id;
  try {
    const clientInvoiceDate = await clientInvoice.findByPk(id);

    if (!clientInvoiceDate) {
      return response.status(500).json({ ack: 0, msg: ` No data found` });
    } else {
      const deletedData = await clientInvoice.destroy({ where: { id } });
      return response.status(200).json({
        ack: 0,
        data: deletedData,
        msg: `Client Invoice deleted successfully`,
      });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

// edit client invoice
exports.editClientInvoice = async (request, response) => {
  const id = request.params.id;
  const { error } = updateClientInvoiceSchema.validate(request.body);
  if (error) {
    return response.status(200).json({ ack: 0, msg: error.details[0].message });
  }
  try {
    const body = request.body;
    const data = await clientInvoice.findByPk(id);
    if (!data) {
      return response
        .status(200)
        .json({ ack: 1, msg: `Please provide valid id` });
    } else {
      const clientInvoiceData = await clientInvoice.update(
        { ...body },
        { where: { id } }
      );
      response.status(200).json({
        ack: 1,
        msg: "Client successfully updated",
        data: clientInvoiceData,
      });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || "Server error" });
  }
};
