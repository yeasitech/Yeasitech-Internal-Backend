const { request, response } = require("express");
const { LeaveModel, LeaveTypeModel } = require("../models/index");

//create leave type
exports.typesOfLeave = async (request, response) => {
  try {
    const createtypesOfLeave = await LeaveTypeModel.create(request.body);
    response.status(200).json({ ack: 1, msg: createtypesOfLeave });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `server Error` });
  }
};

//get type of leaves
exports.getAlltypesOfLeave = async (request, response) => {
  const getAlltypesOfLeave = await LeaveTypeModel.findAll();
  response.status(200).json({ ack: 1, msg: getAlltypesOfLeave });
};

//add leaves by admin
exports.createLeaveByAdmin = async (request, response) => {
  const { leaveFrom, leaveTo, numberOfDays, reasonOfLeave, leaveType } =
    request.body;
  const data = {
    leaveType: +leaveType,
    leaveFrom: new Date(leaveFrom),
    leaveTo: new Date(leaveTo),
    numberOfDays: numberOfDays,
    reasonOfLeave: reasonOfLeave,
  };

  try {
    const createLeave = await LeaveModel.create(data);

    response.status(200).json({ ack: 1, data: createLeave });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `server Error` });
  }
};

// get employee leaves

// exports.employeeLeave = async (request, response) => {
//   const data = await LeaveModel.findAll{}
// };
