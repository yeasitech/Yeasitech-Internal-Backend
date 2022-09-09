const db = require("../models/index");
const jwt = require("jsonwebtoken");
const User = db.User;
const EmployeeDetails = db.EmployeeDetails;
const EducationModel = db.EducationDetails;
const ExperienceModel = db.EmployeeExperience;

const DepartmentModel = db.Department;
const DesignationModel = db.Designation;
const {
  createEmployeeSchema,
  loginSchema,
  employeeDetailsSchema,
} = require("./validation/user.validation");
const bcrypt = require("bcryptjs");
const { request } = require("express");
const { Op } = require("sequelize");

//create new user

exports.createUser = async (request, response) => {
  const { error } = createEmployeeSchema.validate(request.body);

  if (error) {
    response.status(200).json({ ack: 1, msg: error.details[0].message });
    console.log(`efdh`, error);

    return;
  }
  const user = request.body;
  if (!user) throw new Error(`user doesn't exists`);
  const allDept = await DepartmentModel.findByPk(+user.department);

  const allDesignation = await DesignationModel.findOne({
    where: { designation: user.designation },
  });
  // console.log(`<<<<<<<<<`, allDesignation.id);
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
        departmentId: +allDept.id,
        designationId: +allDesignation.id,
        // password: hash,
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
  console.log(`>>>>>>>>>`, request.userId);
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
    console.log(`1234567890`, user.email);

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
  try {
    const allData = await User.findAll({
      include: [{ model: EmployeeDetails }],
    });
    response.status(200).json({ ack: 1, data: allData });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
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
exports.getEmployeeByDesignation = async (request, response) => {
  const designationId = request.params.designationId;
  const getEmployee = await User.findAll({
    where: { designationId: designationId },
  });
  response
    .status(200)

    .json({ ack: 1, msg: getEmployee });
};
exports.getAllEmployeePagination = async (request, response) => {
  const { elements, page } = request.query;

  const limit = parseInt(elements);
  const offset = parseInt(limit * (page - 1));

  try {
    const { count, rows } = await User.findAndCountAll({
      limit,
      offset,
      //order: [["createdAt", "AESC"]],
    });
    response.status(200).json({
      ack: 1,
      data: rows,
      elementCount: rows.length,
      totalElements: count,
      page: parseInt(page),
      elementsPerPage: limit,
    });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

exports.searchUser = async (request, response) => {
  const { firstName, employeeId, designationId, elements, page } =
    request.query;
  // const {  } = request.query;
  const limit = parseInt(elements);
  const offset = parseInt(limit * (page - 1));
  if (
    !firstName &&
    !employeeId &&
    employeeId === null &&
    !designationId &&
    designationId === null
  ) {
    throw new Error(`please give search criteria `);
  }

  // if (firstName) {
  //   const userData = await User.findAll({ where: { firstName: firstName } });
  // } else if (employeeId) {
  //   const userData = await EmployeeDetails.findAll({
  //     where: { employeeId: employeeId },
  //   });
  // } else if (designationId) {
  //   const userData = await User.findAll({
  //     where: { designationId: designationId },
  //   });
  // }
  //let where={};
  let employeeWhere = {};
  let includes = [];
  let where = {};

  if (firstName && firstName !== "") {
    where["firstName"] = { [Op.like]: `%${firstName}%` };
  }
  if (designationId && designationId !== null) {
    where["designationId"] = designationId;
  }

  if (employeeId && employeeId !== "") {
    employeeWhere["employeeId"] = { [Op.like]: `%${employeeId}%` };
    includes.push({ model: EmployeeDetails, where: { ...employeeWhere } });
  }
  if (employeeId && employeeId !== "" && designationId) {
    employeeWhere["employeeId"] = { [Op.like]: `%${employeeId}%` };
    includes.push({ model: EmployeeDetails, where: { ...employeeWhere } });
  }

  // if (firstName) {
  const UserData = await User.findAll({
    where: { ...where },
    include: [...includes],
    offset,
    limit,
  });

  // const employeeData = await EmployeeDetails.findAll({
  //   where: { employeeId: employeeId },
  // });
  response.status(200).json({ msg: UserData });
  // }
};
