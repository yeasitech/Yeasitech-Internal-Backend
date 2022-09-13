const { LeaveModel, LeaveTypeModel } = require("../models/index");
//const LeaveTypeModel = db.LeaveType;
//create leave type
exports.typesOfLeave = async (request, response) => {
  const createtypesOfLeave = await LeaveTypeModel.create(request.body);
  response.status(200).json({ ack: 1, msg: createtypesOfLeave });
};
//get type of leaves
exports.getAlltypesOfLeave = async (request, response) => {
  const getAlltypesOfLeave = await LeaveTypeModel.findAll();
  response.status(200).json({ ack: 1, msg: getAlltypesOfLeave });
};
