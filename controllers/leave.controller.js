const db = require("../models/index");
const LeaveModel = db.Leave;
const LeaveTypeModel = db.LeaveType;

exports.typesOfLeave = async (request, response) => {
  const createtypesOfLeave = await LeaveTypeModel.create(request.body);
  response.status(200).json({ ack: 1, msg: createtypesOfLeave });
};

exports.getAlltypesOfLeave = async (request, response) => {
  const getAlltypesOfLeave = await LeaveTypeModel.findAll();
  response.status(200).json({ ack: 1, msg: getAlltypesOfLeave });
};
