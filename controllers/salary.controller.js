const { User, Salary } = require("../models");

// create salary
exports.employeeSalary = async (request, response) => {
  //const userId = request.body.userId;

  const { salary, userId } = request.body;

  try {
    const userData = await User.findOne({ where: { id: userId } });
    if (!userData) {
      return response.status(200).json({ ack: 1, msg: `employee not exist` });
    } else {
      await salary.map((data) => {
        Salary.create({
          ...data,
          currentSalary: data.currentSalary,
          userId: userId,
        });
      });

      response.status(200).json({
        ack: 1,
        data: `Salary updated sccessfully`,
      });
    }
  } catch (error) {
    response
      .status(500)
      .json({ ack: 0, status: `error`, msg: error.message || `Server Error` });
  }
};

//get employeesalary
exports.getSalary = async (request, response) => {
  const userId = request.params.userId;

  try {
    if (!userId) {
      return response.status(200).json({ ack: 1, msg: `user not exists` });
    } else {
      const salaryDetails = await Salary.findAll({
        where: { userId: userId },
      });

      response.status(200).json({ ack: 1, msg: salaryDetails });
    }
  } catch (error) {
    response
      .status(500)
      .json({ ack: 0, status: `error`, msg: error.message || `Server Error` });
  }
};
