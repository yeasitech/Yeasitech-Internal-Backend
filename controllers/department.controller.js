const { Department, Designation } = require("../models");

//create department
exports.createDepartment = async (request, response) => {
  try {
    const departmentTypes = await Department.create(request.body);
    response.status(200).json({ ack: 1, data: departmentTypes });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `server error` });
  }
};

//delete department
exports.deleteDepartment = async (request, response) => {
  const id = request.params.id;
  const department = await Department.findOne({
    where: { id: id },
  });

  try {
    if (!department || department === null) {
      response.status(500).json({ ack: 0, msg: `invalid department ` });
    } else {
      await Department.destroy({
        where: { id: id },
        // onDelete: "cascade",
      });

      // ]);
      response.status(200).json({ ack: 1, msg: `successfully deleted` });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

// update department
exports.editDepartment = async (request, response) => {
  const id = request.params.id;

  const departments = await Department.findOne({ where: { id: id } });

  const department = request.body.department;
  try {
    if (!departments || departments === null) {
      response.status(500).json({ ack: 0, msg: `invalid department ` });
    } else {
      const updatedDepartment = await Department.update(
        { department },
        {
          where: { id: id },
        }
      );

      response
        .status(200)
        .json({ ack: 1, msg: `Successfully Updated department` });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || "Server Error" });
  }
};

// get department
exports.getDepartment = async (request, response) => {
  try {
    const allDept = await Department.findAll();

    response.status(200).json({ ack: 1, data: allDept });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || "Server Error" });
  }
};

// create designation
exports.createDesignation = async (request, response) => {
  const { departmentId } = request.body;

  if (!departmentId) {
    response.status(500).json({ ack: 0, msg: `invalid department id` });
  }
  const allDepartments = await Department.findByPk(+departmentId);
  if (!allDepartments && allDepartments === null) {
    response.status(500).json({ ack: 0, msg: `invalid department` });
  }
  let user = request.body;
  const userRecord = {
    departmentId: allDepartments.id,
    designation: user.designation,
  };
  const userDesignation = await Designation.create(userRecord);

  response.status(200).json({ ack: 1, data: userDesignation });
};

//get designation by departmentId
exports.getDesignation = async (request, response) => {
  const departmentId = request.params.departmentId;

  try {
    const allDept = await Designation.findAll({
      where: { departmentId: +departmentId },
      attributes: ["designation", "id"],
    });
    response.status(200).json({ ack: 1, data: allDept });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

//get all designation
exports.getAllDesignation = async (request, response) => {
  try {
    const data = await Designation.findAll();

    response.status(200).json({ ack: 1, data: data });
  } catch (error) {
    response.status(200).json({ ack: 0, msg: error.message || `server Error` });
  }
};

//update designation
exports.editDesignation = async (request, response) => {
  const id = request.params.id;

  const designation = request.body.designation;
  try {
    if (!id && id.length <= 0)
      response.status(500).json({ ack: 0, msg: `invalid department id` });
    else {
      const updatedDesignation = await Designation.update(
        { designation },
        {
          where: { id: id },
        }
      );
      response
        .status(200)
        .json({ ack: 1, msg: `Successfully Updated designation` });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || "Server Error" });
  }
};

//delete designation
exports.deleteDesignation = async (request, response) => {
  const designationId = request.params.designationId;

  try {
    if (!designationId || designationId == null)
      return response
        .status(200)
        .json({ ack: 1, msg: `invalid department id` });
    else {
      const designationToDelete = await Designation.destroy({
        where: { id: designationId },
      });

      response.status(200).json({ ack: 1, msg: `successfully deleted` });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

//get all Department Designation
exports.getAllDepartmentDesignation = async (request, response) => {
  try {
    const departments = await Department.findAll({
      include: [{ model: Designation }],
    });
    response.status(200).json({ ack: 1, data: departments });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

// all department pagination
exports.getAllDepartmentPagination = async (request, response) => {
  const { elements, page } = request.query;
  const limit = parseInt(elements);
  const offset = parseInt(limit * (page - 1));

  try {
    const { count, rows: departments } = await Department.findAndCountAll({
      limit,
      offset,
      //order: [["createdAt", "AESC"]],
    });
    response.status(200).json({
      ack: 1,
      data: departments,
      elementCount: departments.length,
      totalElements: count,
      totalpage: Math.ceil(count / elements),
      page: parseInt(page),
      elementsPerPage: limit,
    });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

// all desigantion pagination
exports.getAllDesignationPagination = async (request, response) => {
  const { elements, page } = request.query;
  const limit = parseInt(elements);

  const offset = parseInt(limit * (page - 1));
  try {
    const { count, rows: designation } = await Designation.findAndCountAll({
      include: [{ model: Department }],

      limit,
      offset,
      //order: [["createdAt", "AESC"]],
    });
    response.status(200).json({
      ack: 1,
      data: designation,
      elementCount: designation.length,
      totalElements: count,
      totalpage: Math.ceil(count / elements),
      page: parseInt(page),
      elementsPerPage: limit,
    });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

// update department desigantion
exports.editDepartmentDesignation = async (request, response) => {
  const designationid = request.params.designationid;
  const { designation, departmentId } = request.body;

  const allDesignations = await Designation.findByPk(designationid);

  try {
    if (!allDesignations || allDesignations === null)
      return response.status(200).json({ ack: 1, msg: "invalid designation" });
    const updateDepartmentDesignation = await Designation.update(
      { designation: designation, departmentId: departmentId },
      {
        where: { id: designationid },
      }
    );

    response
      .status(200)

      .json({ ack: 1, msg: `successfully updated department & designation` });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};
