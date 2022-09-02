const db = require("../models/index");

const DepartmentModel = db.Department;
const DesignationModel = db.Designation;

exports.createDepartment = async (request, response) => {
  const departmentTypes = await DepartmentModel.create(request.body);
  response.status(200).json({ ack: 1, data: departmentTypes });
};

exports.deleteDepartment = async (request, response) => {
  const id = request.params.id;
  // console.log(`*********`, id);
  // const designation = await DesignationModel.findAll({
  //   where: { departmentId: id },
  // });
  //console.log(`123456`, designation.id);
  try {
    if (!id && id.length < 0) throw new Error(`invalid department id`);
    else {
      // Promise.all([
      await DesignationModel.destroy({
        where: { departmentId: id },
      });

      await DepartmentModel.destroy({
        where: { id: id },
      });

      // ]);
      response.status(200).json({ ack: 1, msg: `successfully deleted` });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};
exports.editDepartment = async (request, response) => {
  const id = request.params.id;
  //console.log(id);
  department = request.body.department;
  try {
    if (!id && id.length < 0) throw new Error(`invalid department id`);
    else {
      const updatedDepartment = await DepartmentModel.update(
        { department },
        {
          where: { id: id },
        }
      );
      console.log(updatedDepartment);
      response
        .status(200)
        .json({ ack: 1, msg: `Successfully Updated department` });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || "Server Error" });
  }
};
exports.getDepartment = async (request, response) => {
  const allDept = await DepartmentModel.findAll();

  response.status(200).json({ ack: 1, data: allDept });
};

exports.createDesignation = async (request, response) => {
  const { department } = request.body;
  const allDepartments = await DepartmentModel.findByPk(+department);
  console.log(`qwertyu`, allDepartments.id);
  let user = request.body;
  const userRecord = {
    departmentId: allDepartments.id,
    designation: user.designation,
  };
  const userDesignation = await DesignationModel.create(userRecord);
  console.log(userDesignation);
  response.status(200).json({ ack: 1, data: userDesignation });
};

exports.getDesignation = async (request, response) => {
  const departmentId = request.params.departmentId;
  console.log(`1234567`, departmentId);
  try {
    const allDept = await DesignationModel.findAll({
      where: { departmentId: +departmentId },
      attributes: ["designation", "id"],
    });
    response.status(200).json({ ack: 1, data: allDept });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

exports.editDesignation = async (request, response) => {
  const id = request.params.id;

  const designation = request.body.designation;
  try {
    if (!id && id.length <= 0) throw new Error(`invalid department `);
    else {
      const updatedDesignation = await DesignationModel.update(
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

exports.deleteDesignation = async (request, response) => {
  const { id } = request.body;

  try {
    if (!id && id.length < 0) throw new Error(`invalid department id`);
    else {
      const designationToDelete = await DesignationModel.destroy({
        where: { id: id },
      });

      response.status(200).json({ ack: 1, msg: `successfully deleted` });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

exports.getAllDepartmentDesignation = async (request, response) => {
  try {
    const departments = await DepartmentModel.findAll({
      include: [{ model: DesignationModel }],
    });
    response.status(200).json({ ack: 1, data: departments });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};
exports.getAllDepartmentPagination = async (request, response) => {
  const { elements, page } = request.query;
  const limit = parseInt(elements);

  const offset = parseInt(limit * (page - 1));
  try {
    const { count, rows: departments } = await DepartmentModel.findAndCountAll({
      limit,
      offset,
      //order: [["createdAt", "AESC"]],
    });
    response.status(200).json({
      ack: 1,
      data: departments,
      elementCount: departments.length,
      totalElements: count,
      page: parseInt(page),
      elementsPerPage: limit,
    });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

exports.getAllDesignationPagination = async (request, response) => {
  const { elements, page } = request.query;
  const limit = parseInt(elements);
  console.log(`qwertyui`, limit);
  const offset = parseInt(limit * (page - 1));
  try {
    const { count, rows: designation } = await DesignationModel.findAndCountAll(
      {
        limit,
        offset,
        //order: [["createdAt", "AESC"]],
      }
    );
    response.status(200).json({
      ack: 1,
      data: designation,
      elementCount: designation.length,
      totalElements: count,
      page: parseInt(page),
      elementsPerPage: limit,
    });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};
