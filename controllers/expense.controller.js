const { User, Expenses } = require("../models");
const { Op } = require("sequelize");
exports.addExpense = async (request, response) => {
  data = request.body;
  const userId = request.userId;
  const info = {
    item: data.item,
    purchasedBy: data.purchasedBy,
    purchaseFrom: data.purchaseFrom,
    purchaseDate: data.purchaseDate,
    amount: data.amount,
    paidBy: data.paidBy,
    userId: request.userId,
    status: data.status,
  };
  try {
    if (!userId || userId.length < 0) {
      response.status(500).json({ ack: 0, msg: `invalid userId ` });
    } else {
      const expenseData = await Expenses.create(info);

      response
        .status(200)
        .json({ ack: 1, msg: "successfully added expense", data: expenseData });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

exports.getExpenses = async (request, response) => {
  try {
    const expenseData = await Expenses.findAll({
      attributes: ["purchasedBy"],
      group: ["purchasedBy"],
    });
    if (!expenseData) {
      response.status(500).json({ ack: 0, msg: `expense data not found` });
    }

    response
      .status(200)
      .json({ ack: 1, msg: "data fetched successfully", data: expenseData });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

exports.getExpenseList = async (request, response) => {
  const { limits, page, fromDate, toDate, purchasedBy } = request.query;

  const limit = parseInt(limits);
  const offset = parseInt(limit * (page - 1));

  if (fromDate > toDate) {
    response.status(500).json({ ack: 0, msg: `Pleasse provide valid input ` });
    return;
  }

  try {
    const { count, rows: expense } = await Expenses.findAndCountAll({
      where: {
        purchasedBy: { [Op.like]: `%${purchasedBy}%` },
        purchaseDate: { [Op.and]: { [Op.gte]: fromDate, [Op.lte]: toDate } },
      },
      limit,
      offset,
    });
    response.status(200).json({
      ack: 1,
      data: expense,
      elementCount: expense.length,
      totalElements: count,
      totalpage: Math.ceil(count / limit),
      page: parseInt(page),
      elementsPerPage: limit,
    });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

exports.updateExpense = async (request, response) => {
  const id = request.params.id;
  const updatedExpense = request.body;

  try {
    const result = await Expenses.findByPk(id);

    if (!result) {
      response
        .status(500)
        .json({ ack: 0, msg: `No data found with this product id ` });
      return;
    }

    const updatedResult = await Expenses.update(
      { ...updatedExpense },
      { where: { id } }
    );

    response.status(200).json({ ack: 1, msg: `Expense updated successfully` });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

exports.updateExpenseStatus = async (request, response) => {
  const id = request.params.id;
  const updatedExpense = request.body;

  try {
    const result = await Expenses.findByPk(id);
    if (!result) {
      response
        .status(500)
        .json({ ack: 0, msg: `No data found with this product id ` });
      return;
    }

    const updatedResult = await Expenses.update(
      { ...updatedExpense },
      { where: { id } }
    );

    response
      .status(200)
      .json({ ack: 1, msg: `Expense details updated successfully` });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

exports.deleteExpense = async (request, response) => {
  const id = request.params.id;

  const expenseData = await Expenses.findByPk(id);

  try {
    if (!expenseData || expenseData.length < 0) {
      response
        .status(500)
        .json({ ack: 0, msg: `please provide valid details to delete` });
    } else {
      const expenseDataDelete = await Expenses.destroy({ where: { id } });
      response.status(200).json({ ack: 1, msg: `Data deleted successfully` });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};
