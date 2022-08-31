const db = require("../models/index");

const DepartmentModel = db.Department;
const DesignationModel = db.Desigantion;

exports.createDepartment = async (request, response) => {
  const departmentTypes = await DepartmentModel.create(request.body);
  response.status(200).json({ ack: 1, data: departmentTypes });
};

exports.createDesignation = async (request, response) => {
  const userDesignation = await DesignationModel.create(request.body);
  console.log(userDesignation);
  response.status(200).json({ ack: 1, data: userDesignation });
};
exports.deleteDepartment = async (request, response) => {
  const { id } = request.body;
  console.log(`*********`, id);
  if (!id && id.length < 0) throw new Error(`invalid department id`);
  else {
    const departmentToDelete = await DepartmentModel.destroy({
      where: { id: id },
    });
    response.status(200).json({ ack: 1, msg: `successfully deleted` });
  }
};
exports.getDepartment = async (request, response) => {
  const allDept = await DepartmentModel.findAll();

  response.status(200).json({ ack: 1, data: allDept });
};
exports.getDesignation = async (request, response) => {
  const departmentId = request.params.departmentId;
  console.log(`1234567`, departmentId);
  const allDept = await Desigantion.findAll({
    where: { departmentId: departmentId },
    attributes: ["designation"],
  });

  response.status(200).json({ ack: 1, data: allDept });
};
