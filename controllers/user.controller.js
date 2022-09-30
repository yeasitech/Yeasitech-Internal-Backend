const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

const {
  User,
  EmployeeDetails,
  EducationModel,
  DepartmentModel,
  DesignationModel,
  ExperienceModel,
  BankModel,
} = require("../models/index");
const {
  createEmployeeSchema,
  loginSchema,
  employeeDetailsSchema,
} = require("./validation/user.validation");

//create new user
exports.createUser = async (request, response) => {
  const { error } = createEmployeeSchema.validate(request.body);

  if (error) {
    return response.status(200).json({ ack: 1, msg: error.details[0].message });
    console.log(`efdh`, error);
  }
  const user = request.body;
  if (!user) throw new Error(`user doesn't exists`);
  const allDept = await DepartmentModel.findByPk(+user.department);

  const allDesignation = await DesignationModel.findOne({
    where: { designation: user.designation },
  });

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
      const hash = bcrypt.hashSync(user.password, 10);
      const userRecord = {
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        dateOfJoining: user.dateOfJoining,
        // departmentId: +allDept.id,
        // designationId: +allDesignation.id,
        password: hash,
        email: user.email,
        onBoardingStatus: false,
        employeeType: user.employeeType,
        isAdmin: false,
        isActive: true,
      };

      const userData = await User.create({
        ...userRecord,
        onBoardingStatus: false,
      });
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
//employee onBoarding
exports.employeeDetails = async (request, response) => {
  const { personal, education, experience, bankDetails } = request.body;
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
    if (user.onBoardingStatus == true) {
      return response
        .status(200)
        .json({ ack: 0, msg: `you are already onboarded` });
    }
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
            //dateOfBirth: new Date(personal.dateOfBirth),
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
      //bank details
      if (!bankDetails) throw new Error(`please provide bank details`);
      else {
        await bankDetails.map((data) => {
          console.log(`1234567`, { ...data });
          BankModel.create({ ...data, userId: user.id });
        });
      }
      await User.update(
        { onBoardingStatus: true },
        { where: { email: email } }
      );
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
// get all employee details
exports.allEmployee = async (request, response) => {
  try {
    const allData = await User.findAll({
      attributes: ["id", "firstName", "middleName", "lastName"],
    });
    response.status(200).json({ ack: 1, data: allData });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

// get single user details
exports.allSingleUser = async (request, response) => {
  id = request.params.id;
  try {
    const allData = await User.findByPk(
      id
      // include: [{ model: EmployeeDetails }],
    );
    response.status(200).json({ ack: 1, data: allData });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

// single employee details
exports.oneEmployeeDetails = async (request, response) => {
  const id = request.params.id;

  try {
    const detailsOfEmployee = await User.findOne({
      where: { id: id },
      include: [
        { model: EmployeeDetails },
        { model: EducationModel, order: `passoutYear` },
        { model: ExperienceModel },
        { model: BankModel },
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

//employee details by designation
exports.getEmployeeByDesignation = async (request, response) => {
  const designationId = request.params.designationId;
  const getEmployee = await User.findAll({
    where: { designationId: designationId },
  });
  response
    .status(200)

    .json({ ack: 1, data: getEmployee });
};

//employee pagination
exports.getAllEmployeePagination = async (request, response) => {
  const { elements, page, searchParam = "" } = request.query;

  const limit = parseInt(elements);
  const offset = parseInt(limit * (page - 1));
  console.log(`offset`, offset);

  try {
    const { count, rows } = await User.findAndCountAll({
      include: [
        {
          model: EmployeeDetails,
          // attributes: ["employeeImage"],
          // where: {
          //   employeeId: { [Op.like]: `%${employeeId}%` },
          // },
        },
      ],
      where: {
        [Op.or]: [
          { firstName: { [Op.like]: `%${searchParam}%` } },
          { "$EmployeeDetail.employeeId$": { [Op.like]: `%${searchParam}%` } },
        ],
      },
      limit,
      offset,
      //order: [["createdAt", "AESC"]],
    });
    response.status(200).json({
      ack: 1,
      data: rows,
      elementCount: rows.length,
      totalElements: count,
      totalpage: Math.ceil(count / elements),
      page: parseInt(page),
      elementsPerPage: limit,
    });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

//search employee
exports.searchUser = async (request, response) => {
  const { firstName, employeeId, designationId, elements, page } =
    request.query;

  const limit = parseInt(elements);
  const offset = parseInt(limit * (page - 1));
  try {
    if (
      !firstName &&
      !employeeId &&
      employeeId === null &&
      !designationId &&
      designationId === null
    ) {
      response
        .status(500)
        .json({ ack: 0, status: `please give search criteria` });
    }
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
  } catch (error) {
    response.status(500).json({ ack: 1, msg: error.message || `server Error` });
  }
};

//update OneEmployeePersonal Data
exports.editOneEmployeePersonalData = async (request, response) => {
  const userId = request.params.userId;
  const { userInfo, personalInfo } = request.body;
  const userData = await User.findByPk(userId);
  const EmployeeData = await EmployeeDetails.findAll({
    where: { userId },
  });
  // console.log(EmployeeData);
  try {
    if (
      !userData ||
      (userData == null && !EmployeeData) ||
      EmployeeData.length < 0
    ) {
      response.status(500).json({ ack: 0, msg: `invalid userInfo ` });
    } else {
      const [data] = await Promise.all([
        User.update(userInfo, {
          where: { id: userId },
        }),
        EmployeeDetails.update(personalInfo, {
          where: { userId: userId },
        }),
      ]).catch((error) => {
        console.log(`1234567890`, error);
      });
    }

    response.status(200).json({ ack: 1, msg: `user updated successfully` });
  } catch (error) {
    response.status(500).json({ ack: 1, msg: error.message || `Server Error` });
  }
};

//updateEducation
exports.updateEducation = async (request, response) => {
  const id = request.params.id;
  console.log(id);
  const { education } = request.body;

  const educationData = await EducationModel.findByPk(id);
  //console.log(educationData);
  try {
    if (!educationData || educationData.length < 0) {
      response.status(500).json({ ack: 0, msg: `invalid educationInfo` });
    } else {
      const updatedData = await education.map((data) => {
        EducationModel.update(
          { ...data },
          {
            where: { id: id },
          }
        );
      });
      return response.status(200).json({
        ack: 1,
        status: `success`,
        data: `edecationDetails updated successfully`,
      });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

//update Experience
exports.updateExperience = async (request, response) => {
  const id = request.params.id;
  console.log(id);
  const { experience } = request.body;

  const experienceData = await EducationModel.findByPk(id);
  console.log(experienceData);
  try {
    if (!experienceData || experienceData.length < 0) {
      response.status(500).json({ ack: 0, msg: `invalid educationInfo` });
    } else {
      const updatedData = await experience.map((data) => {
        ExperienceModel.update(
          { ...data },
          {
            where: { id: id },
          }
        );
      });
      return response.status(200).json({
        ack: 1,
        status: `success`,
        data: `experience Data updated successfully`,
      });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

// upadte Bank Deatils
exports.bankUpdate = async (request, response) => {
  const id = request.params.id;

  const { bankDetails } = request.body;

  const bankData = await EducationModel.findByPk(id);
  console.log(bankData);
  try {
    if (!bankData || bankData.length < 0) {
      response.status(500).json({ ack: 0, msg: `invalid education Info` });
    } else {
      const updatedData = await bankDetails.map((data) => {
        BankModel.update(
          { ...data },
          {
            where: { id: id },
          }
        );
      });
      return response.status(200).json({
        ack: 1,
        status: `success`,
        data: `bankDetails updated successfully`,
      });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

// make user to admin
exports.makeAdmin = async (request, response) => {
  const id = request.params.id;
  const userData = await User.findByPk(id);
  try {
    if (!userData || userData.length < 0) {
      response.status(500).json({ ack: 0, msg: `invalid  userId` });
    }
    if (userData.isAdmin == false) {
      const makeAdmin = await User.update({ isAdmin: true }, { where: { id } });
      response.status(200).json({
        ack: 1,
        msg: `congrats you are an admin now`,
      });
    }
    if (userData.isAdmin == true) {
      const makeAdmin = await User.update(
        { isAdmin: false },
        { where: { id } }
      );
      response.status(200).json({
        ack: 1,
        msg: `sorry! you are an user now`,
      });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

// Dactive User
exports.setDeactive = async (request, response) => {
  const id = request.params.id;
  const userData = await User.findByPk(id);

  try {
    if (!userData || userData.length < 0) {
      return response.status(500).json({ ack: 0, msg: `invalid  userId` });
    }
    if (userData.isActive == true) {
      const deactive = await User.update(
        { isActive: false },
        { where: { id } }
      );
      response.status(200).json({ ack: 1, msg: `user deactivated` });
    }
    if (userData.isActive == false) {
      const active = await User.update({ isActive: true }, { where: { id } });
      response.status(200).json({ ack: 1, msg: `user activated` });
    }
  } catch (error) {
    response
      .status(500)
      .json({ ack: 0, data: error.message || `Server Error` });
  }
};
