const {
  LeaveModel,
  LeaveTypeModel,
  User,
  EmployeeDetails,
  DesignationModel,
  DepartmentModel,
} = require("../models/index");

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
  let userId = request.params.userId;
  const userData = await User.findByPk(userId);

  const leaveData = request.body;
  const leave = {
    leaveType: leaveData.leaveType,
    leaveFrom: leaveData.leaveFrom,
    leaveTo: leaveData.leaveTo,
    numberOfDays: leaveData.numberOfDays,
    reasonOfLeave: leaveData.reasonOfLeave,
    userId: userId,
  };
  // console.log({ ...leave });
  try {
    if (!userData || userData.length < 0) {
      response.status(500).json({ ack: 0, msg: `invalid  userId` });
    } else {
      const createLeave = await LeaveModel.create({ ...leave });
      response.status(200).json({ ack: 1, data: createLeave });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `server Error` });
  }
};

// get employee leaves

exports.getLeavePagiantion = async (request, response) => {
  const { elements, page } = request.query;
  const limit = parseInt(elements);
  const offset = parseInt(limit * (page - 1));
  try {
    const { count, rows } = await LeaveModel.findAndCountAll({
      include: [
        {
          model: User,
          attributes: ["firstName", "middleName", "lastName", "id"],
          include: [{ model: DesignationModel }],
          include: [{ model: EmployeeDetails, attributes: ["employeeImage"] }],
        },
      ],
      limit,
      offset,
    });
    response.status(200).json({
      ack: 1,
      data: rows,
      elementCount: rows.length,
      totalElements: count,
      totalpage: Math.ceil(count / elements),
      page: parseInt(page),
      elementsPerPage: limit,
    });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `server Error` });
  }
};
