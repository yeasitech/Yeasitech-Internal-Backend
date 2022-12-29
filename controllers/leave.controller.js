const {
  Leave,
  LeaveTypeModel,
  User,
  EmployeeDetails,
  Designation,
  Department,
} = require("../models");
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
  let userId = request.userId;
  let id = request.params.id;
  const userData = await User.findByPk(id);

  const leaveData = request.body;
  const leave = {
    leaveType: leaveData.leaveType,
    leaveFrom: leaveData.leaveFrom,
    leaveTo: leaveData.leaveTo,
    numberOfDays: leaveData.numberOfDays,
    reasonOfLeave: leaveData.reasonOfLeave,
    userId: id,
    status: "pending",
  };

  try {
    if (!userData || userData.length < 0) {
      response.status(500).json({ ack: 0, msg: `invalid  userId` });
    } else {
      const createLeave = await Leave.create({ ...leave });
      response.status(200).json({ ack: 1, data: createLeave });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `server Error` });
  }
};

// get employee leaves

exports.getLeavePagiantion = async (request, response) => {
  const {
    elements,
    page,
    employeeName = "",
    leaveFrom = "",
    startDate = "",
    endDate = "",
    searchByStatus = "",
  } = request.query;
  const limit = parseInt(elements);
  const offset = parseInt(limit * (page - 1));
  // let rangeWhere = {};
  // if (startDate && endDate) {
  //   rangeWhere = {
  //     //  leaveTo: { [Op.lte]: `${endDate}` },
  //   };
  // }
  try {
    const { count, rows } = await Leave.findAndCountAll({
      include: [
        {
          model: User,
          attributes: ["firstName", "middleName", "lastName", "id"],
          include: [
            {
              model: EmployeeDetails,
              attributes: ["employeeImage", "employeeId"],
            },
            { model: Designation, attributes: ["designation"] },
          ],
          // where: {
          //   firstName: { [Op.like]: `%${employeeName}%` },
          // },
        },
      ],
      // where: {
      //   [Op.or]: [
      //     { leaveFrom: { [Op.like]: `%${searchParam}%` } },
      //     { "$User.firstName$": { [Op.like]: `%${searchParam}%` } },
      //   ],
      // },
      ...(leaveFrom && {
        where: {
          leaveFrom: { [Op.eq]: `%${leaveFrom}%` },
        },
      }),
      ...(searchByStatus && {
        where: {
          [Op.or]: [
            { status: { [Op.like]: `%${searchByStatus}%` } },
            { leaveType: { [Op.like]: `%${searchByStatus}%` } },
            { "$User.firstName$": { [Op.like]: `%${searchByStatus}%` } },
          ],
        },
      }),
      ...(startDate &&
        endDate && {
          where: { leaveFrom: { [Op.between]: [startDate, endDate] } },
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
  const leaveData = await Leave.findByPk(id);
  const userData = await User.findByPk(request.userId);

  try {
    if (!leaveData || leaveData.length < 0) {
      response.status(500).json({ ack: 0, msg: `invalid leave id ` });
    } else {
      const UpdatedData = await Leave.update(
        { ...leaveInfo, approvedBy: userData.firstName },
        {
          where: { id: id },
        }
      );
      response.status(200).json({ ack: 1, msg: `leave updated successfully` });
    }
  } catch (error) {
    response.status(500).json({ ack: 1, msg: error.message || `Server Error` });
  }
};

//delete Leave
exports.deleteLeave = async (request, response) => {
  const id = request.params.id;
  const leaveData = await Leave.findByPk(id);

  try {
    if (!leaveData || leaveData.length < 0) {
      return response.status(500).json({ ack: 0, msg: `invalid leaveId` });
    } else {
      const designationToDelete = await Leave.destroy({
        where: { id: id },
      });

      response.status(200).json({ ack: 1, msg: `leave deleted successfully` });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

//leave status update
exports.leaveStatusUpdate = async (request, response) => {
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
  const id = request.params.id;
  const leaveData = await Leave.findByPk(id);
  const updatedData = { status: request.body.status, userId: userId };
  try {
    if (!leaveData || leaveData.length < 0) {
      return response.status(500).json({ ack: 0, msg: `invalid leave id ` });
    }
    if (leaveData.status && leaveData.status.length > 0) {
      const UpdatedData = await Leave.update(updatedData, {
        where: { id: id },
      });
      response
        .status(200)
        .json({ ack: 1, msg: `leave Status updated`, data: userData });
    }
  } catch (error) {
    response.status(500).json({ ack: 1, msg: error.message || `Server Error` });
  }
};
