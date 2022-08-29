const db = require("../models/index");
const jwt = require("jsonwebtoken");
const User = db.User;
const EmployeeDetails = db.EmployeeDetails;
const EducationModel = db.EducationDetails;
const ExperienceModel = db.EmployeeExperience;
const Salary = db.Salary;
const DepartmentModel = db.Department;
const {
  createEmployeeSchema,
  loginSchema,
  employeeDetailsSchema,
} = require("./validation/user.validation");
const bcrypt = require("bcryptjs");

//create new user

exports.createUser = async (request, response) => {
  const { error } = createEmployeeSchema.validate(request.body);

  if (error) {
    response.status(200).json({ ack: 1, msg: error.details[0].message });
    console.log(`efdh`, error);

    return;
  }
  const user = request.body;
  const allDept = await DepartmentModel.findOne({
    where: { department: user.department },
  });
  console.log(`qwertyyuiop`, allDept);
  try {
    const checkForIfExists = await User.findOne({
      where: { email: request.body.email },
    });
    if (checkForIfExists) {
      response.status(200).json({
        ack: 0,
        msg: "User exists with this email",
      });
    } else {
      //const hash = bcrypt.hashSync(user.password, 10);
      const userRecord = {
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        dateOfJoining: user.dateOfJoining,
        department: user.department,
        departmentId: allDept.id,
        designation: user.designation,
        //password: hash,
        email: user.email,
        isActive: 1,
      };
      const userData = await User.create(userRecord);
      response
        .status(200)
        .json({ ack: 1, msg: "successfully created", data: userData });
    }
  } catch (error) {
    console.error("Error => ", error);
    response.status(500).json({ ack: 0, msg: error.message || "Server error" });
  }
};

// Log In User
exports.logIn = async (request, response) => {
  const { error } = loginSchema.validate(request.body);
  if (error) {
    response.status(200).json({ ack: 1, msg: error.details[0].message });
    return false;
  } else {
    try {
      const checkForIfExists = await User.findOne({
        where: { email: request.body.email },
      });
      if (checkForIfExists) {
        if (!checkForIfExists.dataValues.isActive) {
          response.status(200).json({
            ack: 0,
            msg: "User disabled, Please contact us through our website",
          });
          return false;
        }
        if (
          bcrypt.compareSync(
            request.body.password,
            checkForIfExists.dataValues.password
          )
        ) {
          const token = jwt.sign(
            { id: checkForIfExists.dataValues.id },
            process.env.SECRET_KEY,
            {
              algorithm: process.env.JWT_ALGORITHM,
              expiresIn: process.env.JWT_EXPIRE,
            }
          ); // expires in 30 days
          delete checkForIfExists.dataValues.password;
          response.status(200).json({
            ack: 1,
            status: "success",
            msg: "Logged in Successfully",
            data: { user: checkForIfExists, token },
          });
        } else {
          response.status(200).json({
            ack: 0,
            status: "error",
            msg: "Invalid email or password",
          });
        }
      } else {
        response.status(200).json({
          ack: 0,
          status: "error",
          msg: "Email ID not registered",
        });
      }
    } catch (error) {
      response
        .status(500)
        .json({ ack: 0, msg: error.message || "Server error" });
    }
  }
};

exports.employeeDetails = async (request, response) => {
  const { personal, education, experience } = request.body;
  const { email } = request.body.personal;

  const { error } = employeeDetailsSchema.validate({ email });
  if (error) {
    response.status(400).json({
      ack: 1,
      error: "invalid email Id",
      msg: error.details[0].message,
    });

    return;
  }

  try {
    let user = await User.findOne({ where: { email: email } });
    console.log(`1234567890`, user);

    if (email !== user.email) throw new Error(`employee not exists`);
    else {
      //personal details
      if (!personal) throw new Error(`please provide personal details`);
      else {
        personal.userId = user.id;
        let getAllEmployee = await EmployeeDetails.findAll({
          order: [["employeeId", "DESC"]],
          limit: 1,
        });
        let employeeIdToSave;
        if (getAllEmployee.length === 0) {
          let employeeId = `YT-1`;
          await EmployeeDetails.create({
            ...personal,
            userId: user.id,
            employeeId: employeeId,
          });
        } else {
          let { employeeId } = getAllEmployee[0].dataValues;

          let employeeIdNumber = parseInt(employeeId.split("-")[1]);
          employeeIdToSave = `YT-${employeeIdNumber + 1}`;
          await EmployeeDetails.create({
            ...personal,
            userId: user.id,
            employeeId: employeeIdToSave,
          });
        }
      }

      // Eduaction Details
      if (!education) throw new Error(`please provide education details`);
      else {
        await education.map((data) => {
          EducationModel.create({ ...data, userId: user.id });
        });
      }

      //experience details
      if (!experience) throw new Error(`please provide experience details`);
      else {
        await experience.map((data) => {
          ExperienceModel.create({ ...data, userId: user.id });
        });
      }
      return response.status(200).json({
        ack: 1,
        status: "success",
        msg: "Employee updated successfully",
      });
    }
  } catch (error) {
    console.log("error", error);
    response
      .status(500)
      .json({ ack: 0, status: `error`, msg: error.message || "Server error" });
  }
};
exports.allUser = async (request, response) => {
  const { count, rows } = await User.findAndCountAll({
    include: [{ model: EmployeeDetails }],
  });

  response.status(200).json({ ack: 1, data: { rows, count } });
};

exports.oneEmployeeDetails = async (request, response) => {
  const id = request.params.id;

  try {
    const detailsOfEmployee = await User.findOne({
      where: { id: id },
      include: [
        { model: EmployeeDetails },
        { model: EducationModel },
        { model: ExperienceModel },
      ],
      // order: [
      //   [{ model: EducationModel }, "passoutYear", "DESC"],
      //   [{ model: ExperienceModel }, "dateOfLeaving"],
      // ],
    });

    response.status(200).json({ ack: 1, data: detailsOfEmployee });
  } catch (error) {
    response
      .status(500)
      .json({ ack: 0, status: `error`, msg: error.message || "Server error" });
  }
};

exports.employeeSalary = async (request, response) => {
  const { userId, salary } = request.body;
  console.log(salary);
  try {
    const userData = await User.findOne({ where: { id: userId } });
    if (!userData) throw new Error(`employee not exists`);
    else {
      await salary.map((data) => {
        Salary.create({
          ...data,
          previousSalary: parseInt(data.previousSalary),
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
      .json({ ack: 0, status: `error`, msg: error.message || `server Error` });
  }
};
