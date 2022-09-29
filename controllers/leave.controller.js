const {
  LeaveModel,
  LeaveTypeModel,
  User,
  EmployeeDetails,
  DesignationModel,
  DepartmentModel,
} = require("../models/index");
const { Op } = require("sequelize");
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
exports.createLeaveByUser = async (request, response) => {
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
    status: "pending",
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
  const { elements, page, employeeName = "", leaveFrom } = request.query;
  const limit = parseInt(elements);
  const offset = parseInt(limit * (page - 1));
  try {
    const { count, rows } = await LeaveModel.findAndCountAll({
      include: [
        {
          model: User,
          attributes: ["firstName", "middleName", "lastName", "id"],
          include: [
            { model: EmployeeDetails, attributes: ["employeeImage"] },
            { model: DesignationModel, attributes: ["designation"] },
          ],
          where: {
            firstName: { [Op.like]: `%${employeeName}%` },
            //   // { middleName: { [Op.like]: `%${employeeName}%` } },
            //   // { lastName: { [Op.like]: `%${employeeName}%` } },
          },
        },
      ],
      ...(leaveFrom && {
        where: {
          leaveFrom: { [Op.eq]: `%${leaveFrom}%` },
        },
      }),
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

//update Leave
exports.leaveUpdate = async (request, response) => {
  const id = request.params.id;
  const { leaveInfo } = request.body;
  const leaveData = await LeaveModel.findByPk(id);
  try {
    if (!leaveData || leaveData.length < 0) {
      response.status(500).json({ ack: 0, msg: `invalid leave id ` });
    } else {
      const UpdatedData = await LeaveModel.update(leaveInfo, {
        where: { id: id },
      });
      response.status(200).json({ ack: 1, msg: `leave updated successfully` });
    }
  } catch (error) {
    response.status(500).json({ ack: 1, msg: error.message || `Server Error` });
  }
};

//delete Leave
exports.deleteLeave = async (request, response) => {
  const id = request.params.id;
  const leaveData = await LeaveModel.findByPk(id);
  console.log(leaveData);
  try {
    if (!leaveData || leaveData.length < 0) {
      return response.status(500).json({ ack: 0, msg: `invalid leaveId` });
    } else {
      const designationToDelete = await LeaveModel.destroy({
        where: { id: id },
      });

      response.status(200).json({ ack: 1, msg: designationToDelete });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

//leave status update
exports.leaveStatusUpdate = async (request, response) => {
  const userId = request.userId;
  const userData = await User.findByPk(userId);
  console.log(`123456789`, userId);
  console.log(`qwertyuiop[]`, userData);
  const leaveData = await LeaveModel.findByPk(id);

  try {
    if (!leaveData || leaveData.length < 0) {
      return response.status(500).json({ ack: 0, msg: `invalid leave id ` });
    }
    if (leaveData.status && leaveData.status.length > 0) {
      const UpdatedData = await LeaveModel.update(request.body, {
        where: { id: id },
      });
      response.status(200).json({ ack: 1, msg: `leave Status updated` });
    }
  } catch (error) {
    response.status(500).json({ ack: 1, msg: error.message || `Server Error` });
  }
};
