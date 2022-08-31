const db = require("../models/index");
const Salary = db.Salary;
const User = db.User;

exports.employeeSalary = async (request, response) => {
  //const userId = request.body.userId;

  const { salary, userId } = request.body;

  try {
    const userData = await User.findOne({ where: { id: userId } });

    if (!userData) throw new Error(`employee not exists`);
    else {
      await salary.map((data) => {
        Salary.create({
          ...data,
          //previousSalary: parseInt(data.previousSalary),
          currentSalary: parseInt(data.currentSalary),
          userId: userId,
        });
      });

      response.status(200).json({
        ack: 1,

        msg: "salary updated successfully",
      });
    }
  } catch (error) {
    response
      .status(500)
      .json({ ack: 0, status: `error`, msg: error.message || `Server Error` });
  }
};

exports.getSalary = async (request, response) => {
  const userId = request.params.userId;
  console.log(userId);
  try {
    if (!userId) {
      throw new Error(`user not exists`);
    } else {
      const salaryDetails = await Salary.findAll({ where: { userId: userId } });

      response.status(200).json({ ack: 1, msg: salaryDetails });
    }
  } catch (error) {
    response
      .status(500)
      .json({ ack: 0, status: `error`, msg: error.message || `Server Error` });
  }
};
