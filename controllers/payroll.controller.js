const { payroll, payrollSheet, User } = require("../models");

exports.createPayroll = async (request, response) => {
  try {
    const departmentTypes = await payroll.create({
      ...request.body,
      isProcessed: false,
    });
    response.status(200).json({ ack: 1, data: departmentTypes });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `server error` });
  }
};

// edit payroll
exports.editPayroll = async (request, response) => {
  const id = request.params.id;
  try {
    if (!id && id.length <= 0)
      response.status(500).json({ ack: 0, msg: `invalid payrollId` });
    else {
      const payrollData = await payroll.findByPk(id);
      if (!payrollData) {
        response.status(500).json({ ack: 0, msg: `invalid payroll Data` });
      } else {
        const updatedPayroll = await payroll.update(
          { ...request.body },
          {
            where: { id },
          }
        );
        response
          .status(200)
          .json({ ack: 1, msg: `Successfully Updated payroll` });
      }
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || "Server Error" });
  }
};

// payroll list
exports.payrollList = async (request, response) => {
  const { elements, page } = request.query;
  const limit = parseInt(elements);
  const offset = parseInt(limit * (page - 1));

  try {
    const { count, rows: payrollData } = await payroll.findAndCountAll({
      limit,
      offset,
      //order: [["createdAt", "AESC"]],
    });
    response.status(200).json({
      ack: 1,
      data: payrollData,
      elementCount: payrollData.length,
      totalElements: count,
      totalpage: Math.ceil(count / elements),
      page: parseInt(page),
      elementsPerPage: limit,
    });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

// is precessing update
exports.editIsProcess = async (request, response) => {
  const id = request.params.id;
  try {
    if (!id && id.length <= 0)
      response.status(500).json({ ack: 0, msg: `invalid payrollId` });
    else {
      const payrollData = await payroll.findByPk(id);
      if (!payrollData) {
        response.status(500).json({ ack: 0, msg: `invalid payroll Data` });
      } else {
        const updatedPayroll = await payroll.update(
          { isProcessed: !payrollData.isProcessed },
          {
            where: { id },
          }
        );
        response
          .status(200)
          .json({ ack: 1, msg: `Successfully Updated payroll` });
      }
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || "Server Error" });
  }
};

// delete payroll
exports.deletePayroll = async (request, response) => {
  const id = request.params.id;
  try {
    if (!id && id.length <= 0)
      response.status(500).json({ ack: 0, msg: `invalid payrollId` });
    else {
      const payrollData = await payroll.findByPk(id);
      if (!payrollData) {
        response.status(500).json({ ack: 0, msg: `invalid payroll Data` });
      } else {
        const deletedPayroll = await payroll.destroy({
          where: { id },
        });
        response.status(200).json({
          ack: 1,
          msg: `Successfully Deleted payroll`,
          data: deletedPayroll,
        });
      }
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || "Server Error" });
  }
};
