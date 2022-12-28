const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

const {
  User,
  EmployeeDetails,
  EducationDetails,
  Department,
  Designation,
  EmployeeExperience,
  BankDetails,
  Interview,
  Assets,
  Comments,
  Leave,
  Salary,
  Expenses,
} = require("../models");
const {
  createEmployeeSchema,
  loginSchema,
  employeeDetailsSchema,
  changePasswordSchema,
} = require("./validation/user.validation");

//create new user
exports.createUser = async (request, response) => {
  const { error } = createEmployeeSchema.validate(request.body);

  if (error) {
    return response.status(200).json({ ack: 1, msg: error.details[0].message });
  }
  const user = request.body;
  if (!user)
    return response.status(200).json({ ack: 1, msg: `Please give valid user` });

  try {
    const allDept = await Department.findByPk(user.department);
    const allDesignation = await Designation.findByPk(user.designation);

    const checkForIfExists = await User.findOne({
      where: { email: request.body.email },
    });
    if (checkForIfExists) {
      response.status(200).json({
        ack: 0,
        msg: "User exists with this email",
      });
    } else {
      console.log(`user-passowrd`, user.password);
      //const hash = bcrypt.hashSync(user.password, 10);
      const userRecord = {
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        dateOfJoining: user.dateOfJoining,
        departmentId: allDept.id,
        designationId: allDesignation.id,
        // password: hash,
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
            msg: "User not exist",
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
        .json({ ack: 11, msg: error.message || "Server error" });
    }
  }
};
//employee onBoarding
exports.employeeDetails = async (request, response) => {
  const { personal, education, experience, bankDetails } = request.body;
  const { email } = request.body.personal;
  const { error } = employeeDetailsSchema.validate({ email });
  if (error) {
    return response.status(400).json({
      ack: 0,
      error: "invalid email Id",
      msg: error.details[0].message,
    });
  }

  try {
    let user = await User.findOne({ where: { email: email } });
    if (!user)
      return response
        .status(200)
        .json({ ack: 0, msg: `employee not exists with this email` });
    if (user.onBoardingStatus == true) {
      return response
        .status(200)
        .json({ ack: 0, msg: `you are already onboarded` });
    }
    if (email !== user.email)
      return response.status(200).json({ ack: 0, msg: `employee not exists` });
    else {
      //personal details
      if (!personal)
        response
          .status(200)
          .json({ ack: 1, msg: `please provide personal details` });
      else {
        personal.userId = user.id;
        let getAllEmployee = await EmployeeDetails.findAll({
          order: [["createdAt", "DESC"]],
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
      if (education) {
        await Promise.all(
          education.map(async (data) => {
            //console.log({ ...data });
            await EducationDetails.create({ ...data, userId: user.id });
          })
        );
      }

      // //experience details
      if (!experience)
        response
          .status(200)
          .json({ ack: 1, msg: `please provide experience details` });
      else {
        await Promise.all(
          experience.map(async (data) => {
            await EmployeeExperience.create({ ...data, userId: user.id });
          })
        );
      }
      // //bank details
      if (!BankDetails)
        response
          .status(200)
          .json({ ack: 1, msg: `please provide bank details` });
      else {
        await Promise.all(
          bankDetails.map(async (data) => {
            await BankDetails.create({ ...data, userId: user.id });
          })
        );
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
      include: [
        {
          model: Salary,
          attributes: ["currentSalary"],
          order: [["updatedAt", "DESC"]],
          limit: 1,
        },
      ],
    });
    // const userId = allData.map((value) => {
    //   return value.id;
    // });
    // console.log(userId);
    // const salaryData = await Salary.findAll({
    //   attributes: ["id", "userId", "currentSalary"],
    //   where: { userId: { [Op.in]: userId } },
    //   order: [["updatedAt", "DESC"]],
    //   limit: 1,
    // });
    response.status(200).json({ ack: 1, data: allData });
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

// get single user details
exports.allSingleUser = async (request, response) => {
  id = request.params.id;
  try {
    const allData = await User.findOne({
      where: { id: id },
      attributes: [
        "firstName",
        "middleName",
        "lastName",
        "id",
        "email",
        "dateOfJoining",
        "onBoardingStatus",
      ],
    });
    if (allData.onBoardingStatus === true) {
      return response
        .status(200)
        .json({ ack: 1, msg: `you are already onboarded`, data: allData });
    } else {
      response.status(200).json({ ack: 1, data: allData });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

// single employee details
exports.oneEmployeeDetails = async (request, response) => {
  const id = request.params.id;

  try {
    const detailsOfEmployee = await User.findOne({
      attributes: [
        "firstName",
        "middleName",
        "lastName",
        "id",
        "email",
        "dateOfJoining",
      ],
      where: { id: id },
      include: [
        { model: EmployeeDetails },
        { model: EducationDetails, order: `passoutYear` },
        { model: EmployeeExperience },
        { model: BankDetails },
        { model: Department },
        { model: Designation },
      ],
      // order: [
      //   [{ model: EducationDetails }, "passoutYear", "DESC"],
      //   [{ model: EmployeeExperience }, "dateOfLeaving"],
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
  response.status(200).json({ ack: 1, data: getEmployee });
};

//employee pagination
exports.getAllEmployeePagination = async (request, response) => {
  const { elements, page, searchParam = "" } = request.query;

  const limit = parseInt(elements);
  const offset = parseInt(limit * (page - 1));

  try {
    const { count, rows } = await User.findAndCountAll({
      attributes: [
        "firstName",
        "middleName",
        "lastName",
        "id",
        "email",
        "dateOfJoining",
        "employeeType",
        "onBoardingStatus",
        "isAdmin",
        "isActive",
        "departmentId",
      ],

      include: [
        {
          model: EmployeeDetails,
          attributes: ["employeeImage", "employeeId"],
        },
        { model: Department },
        { model: Designation },
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
    //   Promise.all(
    //     await answer.map((value, key) => {
    //       Option.create({
    //         text: value.text,
    //         order: key + 1,
    //         questionId: questionData.id,
    //         isCorrect: value.isCorrect,
    //       });
    //     })
    //   );
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
  const id = request.body.id;
  const { userInfo, personalInfo } = request.body;

  const userData = await User.findByPk(id);
  const EmployeeData = await EmployeeDetails.findOne({
    where: { userId: id },
  });

  try {
    if (
      !userData ||
      (userData == null && !EmployeeData) ||
      EmployeeData == null
    ) {
      response.status(500).json({ ack: 0, msg: `invalid userInfo ` });
    } else {
      const [data] = await Promise.all([
        User.update(userInfo, {
          where: { id: id },
        }),
        EmployeeDetails.update(personalInfo, {
          where: { userId: id },
        }),

        //response.status(200).json({ ack: 1, msg: data }),
      ]).catch((error) => {});
      response.status(200).json({ ack: 1, msg: ` user updated successfully` });
    }
  } catch (error) {
    response.status(500).json({ ack: 1, msg: error.message || `Server Error` });
  }
};

//updateEducation
exports.updateEducation = async (request, response) => {
  const id = request.params.id;
  const { education } = request.body;

  const educationData = await EducationDetails.findByPk(id);

  try {
    if (!educationData || educationData.length < 0) {
      response.status(500).json({ ack: 0, msg: `invalid educationInfo` });
    } else {
      const updatedData = await education.map((data) => {
        EducationDetails.update(
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
  const { experience } = request.body;

  const experienceData = await EducationDetails.findByPk(id);
  try {
    if (!experienceData || experienceData.length < 0) {
      response.status(500).json({ ack: 0, msg: `invalid educationInfo` });
    } else {
      const updatedData = await experience.map((data) => {
        EmployeeExperience.update(
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

  const bankData = await EducationDetails.findByPk(id);
  try {
    if (!bankData || bankData.length < 0) {
      response.status(500).json({ ack: 0, msg: `invalid education Info` });
    } else {
      const updatedData = await bankDetails.map((data) => {
        BankDetails.update(
          { ...data },
          {
            where: { id: id },
          }
        );
      });
      return response.status(200).json({
        ack: 1,
        status: `success`,
        data: `BankDetails updated successfully`,
      });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

// make user to admin
exports.makeAdmin = async (request, response) => {
  const userId = request.userId;
  const id = request.params.id;
  const userData = await User.findByPk(id);
  try {
    if (!userData || userData == null) {
      response.status(500).json({ ack: 0, msg: `invalid  userId` });
    }
    if (userData.isAdmin == false) {
      const makeAdmin = await User.update(
        { isAdmin: true },
        { where: { id: id } }
      );
      response.status(200).json({
        ack: 1,
        msg: `congrats you are an admin now`,
      });
    }
    if (userData.isAdmin == true) {
      const makeAdmin = await User.update(
        { isAdmin: false },
        { where: { id: id } }
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
  const userId = request.userId;
  const id = request.params.id;
  const userData = await User.findByPk(id);

  try {
    if (!userData || userData == null) {
      return response.status(500).json({ ack: 0, msg: `invalid  userId` });
    }
    if (userData.isActive == true) {
      const deactive = await User.update(
        { isActive: false },
        { where: { id: id } }
      );
      response.status(200).json({ ack: 1, msg: `user deactivated` });
    }
    if (userData.isActive == false) {
      const active = await User.update(
        { isActive: true },
        { where: { id: id } }
      );
      response.status(200).json({ ack: 1, msg: `user activated` });
    }
  } catch (error) {
    response
      .status(500)
      .json({ ack: 0, data: error.message || `Server Error` });
  }
};

// delete user
exports.deleteUser = async (request, response) => {
  const id = request.params.id;
  const userData = await User.findByPk(id);

  try {
    if (!userData) {
      return response.status(500).json({ ack: 0, msg: `invalid user id` });
    } else {
      await EmployeeExperience.destroy({
        where: { userId: id },
      }),
        await BankDetails.destroy({
          where: { userId: id },
        }),
        await EducationDetails.destroy({
          where: { userId: id },
        }),
        await EmployeeDetails.destroy({
          where: { userId: id },
        }),
        await Interview.destroy({
          where: { interviewAssignTo: id },
        });
      await Expenses.destroy({
        where: { UserId: id },
      });
      await Assets.destroy({
        where: { userId: id },
      });
      await Comments.destroy({
        where: { userId: id },
      });
      await Leave.destroy({
        where: { userId: id },
      });
      await Salary.destroy({
        where: { userId: id },
      });
      await User.destroy({
        where: { id: id },
      });
      response.status(200).json({ ack: 1, msg: ` User Deleted successfully` });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

// Change Password
exports.changePassword = async (request, response) => {
  const { error } = changePasswordSchema.validate(request.body);
  const id = request.userId;

  if (error) {
    response.status(200).json({ ack: 0, msg: error.details[0].message });
  } else {
    try {
      const checkForIfExists = await User.findOne({
        where: { id, isActive: 1 },
      });
      if (checkForIfExists === null) {
        response.status(200).json({ ack: 0, msg: "User not Found" });
        return;
      }
      const isNewPasswordMatch = bcrypt.compareSync(
        request.body.newPassword,
        checkForIfExists.dataValues.password
      );
      if (isNewPasswordMatch) {
        response
          .status(200)
          .json({ ack: 0, msg: "You can not use your old password" });
        return;
      }
      const isPasswordMatchs = bcrypt.compareSync(
        request.body.password,
        checkForIfExists.dataValues.password
      );
      if (isPasswordMatchs) {
        const hash = bcrypt.hashSync(request.body.newPassword, 10);

        await User.update(
          {
            password: hash,
          },
          {
            where: {
              id: checkForIfExists.dataValues.id,
            },
          }
        );
        response.status(200).json({
          ack: 1,
          msg: "password changed successfully",
        });
      } else {
        response.status(200).json({
          ack: 1,
          msg: "password does not match",
        });
      }
    } catch (error) {
      console.log("error", error);
      response
        .status(500)
        .json({ ack: 0, msg: error.message || "Server error" });
    }
  }
};

// Reset password
// exports.resetPassword=async(request,response)=>{

// }
