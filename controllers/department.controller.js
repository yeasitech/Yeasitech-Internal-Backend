const db = require("../models/index");

const DepartmentModel = db.Department;
exports.department = async (request, response) => {
  const departmentTypes = await DepartmentModel.create(request.body);
  response
    .status(200)
    .json({ ack: 1, status: `success`, data: departmentTypes });
};
