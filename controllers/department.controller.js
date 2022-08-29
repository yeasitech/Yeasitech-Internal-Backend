const { Desigantion } = require("../models/index");
const db = require("../models/index");

const DepartmentModel = db.Department;
const DesignationModel = db.Desigantion;

exports.department = async (request, response) => {
  const departmentTypes = await DepartmentModel.create(request.body);
  response.status(200).json({ ack: 1, data: departmentTypes });
};

exports.designation = async (request, response) => {
  const userDesignation = await DesignationModel.create(request.body);
  console.log(userDesignation);
  response.status(200).json({ ack: 1, data: userDesignation });
};
exports.getDepartment = async (request, response) => {
  const allDept = await DepartmentModel.findAll();

  response.status(200).json({ ack: 1, data: allDept });
};
exports.getDesignation = async (request, response) => {
  const { department } = request.body;

  const allDept = await DepartmentModel.findAll({
    where: { department: department },
    attributes: [],
    include: { model: Desigantion, attributes: ["designation"] },
  });
  // console.log(`qwertyui`, allDept[0].dataValues.id);

  // const allDesignation = await DesignationModel.findAll({
  //   where: { departmentId: allDept.id },
  // });
  response.status(200).json({ ack: 1, data: allDept });
};
