const db = require("../models/index");
const jwt = require("jsonwebtoken");
const User = db.user;
const employeeDetails = db.employeeDetails;
const educationModel = db.educationModel;
const experienceModel = db.experience;
const {
  createEmployeeSchema,
  loginSchema,
  employeeDetailsSchema,
} = require("./validation/user.validation");
const bcrypt = require("bcryptjs");
//const educationModel = require("../models/education.model");
const employeeDetailsModel = require("../models/employeeDetails.model");

//create new user

exports.createUser = async (request, response) => {
  const { error } = createEmployeeSchema.validate(request.body);

  if (error) {
    response.status(200).json({ ack: 1, msg: error.details[0].message });
    console.log(`efdh`, error);
    return;
  }
  const user = request.body;
  try {
    const checkForIfExists = await User.findOne({
      where: { email: request.body.email },
    });
    if (checkForIfExists) {
      response.status(200).json({
        status: "error",
        msg: "User exists with this email",
      });
    } else {
      const hash = bcrypt.hashSync(user.password, 10);
      const userRecord = {
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        password: hash,
        email: user.email,
        isActive: 1,
      };
      const userData = await User.create(userRecord);
      response.status(200).json({ status: "success", data: userData });
    }
  } catch (error) {
    console.error("Error => ", error);
    response
      .status(500)
      .json({ status: "error", msg: error.message || "Server error" });
  }
};

// Log In User
exports.logIn = async (request, response) => {
  const { error } = loginSchema.validate(request.body);
  if (error) {
    response
      .status(200)
      .json({ status: "error", msg: error.details[0].message });
    return false;
  } else {
    try {
      const checkForIfExists = await User.findOne({
        where: { email: request.body.email },
      });
      if (checkForIfExists) {
        if (!checkForIfExists.dataValues.isActive) {
          response.status(200).json({
            status: "error",
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
            status: "success",
            msg: "Logged in Successfully",
            data: { user: checkForIfExists, token },
          });
        } else {
          response.status(200).json({
            status: "error",
            msg: "Invalid email or password",
          });
        }
      } else {
        response.status(200).json({
          status: "error",
          msg: "Email ID not registered",
        });
      }
    } catch (error) {
      response.status(500).json({ msg: error.message || "Server error" });
    }
  }
};
//add employeeDetails
exports.employeeDetails = async (request, response) => {
  // const email = request.body.email;
  const { id, email } = request.body;

  const { error } = employeeDetailsSchema.validate({ email });
  // console.log({ id });

  if (error) {
    response
      .status(400)
      .json({ error: "invalid email Id", msg: error.details[0].message });

    return;
  }
  try {
    let user = await User.findByPk(id);
    console.log(user);
    if (!user) throw new Error("employee not exists");
    else {
      const {} = request.body;

      delete info.id;
      const updatedUser = await employeeDetails.create(
        {
          userId: id,
        },
        { where: { email } }
      );
      response.status(200).json({
        msg: "data inserted successfully",
        data: updatedUser,
      });
    }
  } catch (error) {
    console.log("error", error);
    response.status(500).json({ ack: 1, msg: error.message || "Server error" });
  }
};

exports.employeeDetails = async (request, response) => {
  const { id, personal, education, experience } = request.body;
  const { email } = request.body.personal;
  console.log(`123445566`, email);
  const { error } = employeeDetailsSchema.validate({ email });
  if (error) {
    response
      .status(400)
      .json({ error: "invalid email Id", msg: error.details[0].message });

    return;
  }
  //const { id, personal, education, experience } = request.body;
  try {
    let user = await User.findOne({ where: { email: email } });
    console.log(`qwertyui`, user.email);
    if (email !== user.email) throw new Error(`employee not exists`);
    else {
      //personal details
      if (!personal) throw new Error(`please provide personal details`);
      else {
        // const count = await User.count();
        // personal.employeeId = `YT-${count}`;
        personal.userId = user.id;
        await employeeDetails.create({
          ...personal,
        });
      }
      // response.status(200).json({ data: forPersonal });

      // Eduaction Details
      if (!education) throw new Error(`please provide education details`);
      else {
        education.userId = user.id;
        const forEducation = education.map((item) => ({
          ...item,
        }));
        console.log(forEducation[0].percentage);

        await forEducation.map((data) => {
          educationModel.create(data);
        });
      }
      //experience details
      if (!experience) throw new Error(`please provide experience details`);
      else {
        experience.userId = user.id;
        const forExperience = experience.map((item) => ({
          ...item,
        }));
        //console.log(forExperience[0]);

        await forExperience.map((data) => {
          experienceModel.create(data);
        });
      }
      return response
        .status(200)
        .json({ status: "success", msg: "Employee updated successfully" });
    }
  } catch (error) {
    console.log("error", error);
    response
      .status(500)
      .json({ status: `error`, msg: error.message || "Server error" });
  }
};

// const employeeExperience = [
//   {
//     employeeName: request.body.employeeName,
//     designation: request.body.designation,
//     salary: request.body.salary,
//     dateOfJoining: request.body.dateOfJoining,
//     dateOfLeaving: request.body.dateOfJoining,
//     workedOrganization: request.body.workedOrganization,
//     userId: request.body.userId,
//   },
// ];
//const data = employeeExperience.map((item) => {});
//};

// const PrevoiusCompanies=[{
//   name:"",
//   designation:""
// }]

// data = PrevoiusCompanies.map(item=>({name: "", email: "", ...item}))

// data.map(item=>{
//   educationModel.create(item)
// })
