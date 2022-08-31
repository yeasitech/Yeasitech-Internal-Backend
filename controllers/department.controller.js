const db = require("../models/index");

const DepartmentModel = db.Department;
const DesignationModel = db.Designation;

exports.createDepartment = async (request, response) => {
  const departmentTypes = await DepartmentModel.create(request.body);
  response.status(200).json({ ack: 1, data: departmentTypes });
};

exports.deleteDepartment = async (request, response) => {
  const { id } = request.body;
  // console.log(`*********`, id);
  try {
    if (!id && id.length < 0) throw new Error(`invalid department id`);
    else {
      const departmentToDelete = await DepartmentModel.destroy({
        where: { id: id },
      });
      response.status(200).json({ ack: 1, msg: `successfully deleted` });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};
exports.editDepartment = async (request, response) => {
  const id = request.params.id;
  console.log(id);
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
  const allDepartments = await DepartmentModel.findOne({
    where: { department: department },
  });
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
    const allDept = await Desigantion.findAll({
      where: { departmentId: departmentId },
      attributes: ["designation"],
    });
    response.status(200).json({ ack: 1, data: allDept });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};
