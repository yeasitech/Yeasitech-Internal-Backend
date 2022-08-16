const db = require("../models/index");
const jwt = require("jsonwebtoken");
const User = db.user;
const {
  createEmployeeSchema,
  loginSchema,
  addEmployeeSchema,
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
  try {
    const checkForIfExists = await User.findOne({
      where: { email: request.body.email },
    });
    if (checkForIfExists) {
      response.status(200).json({
        sattus: "error",
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

exports.addEmployeeSchema = async (request, response) => {
  const { email } = request.body;
  console.log(`abcdefgh`, email);
  const { error } = addEmployeeSchema.validate({ email });

  if (error) {
    response.status(400).json({ ack: 0, msg: error.details[0].message });

    return;
  }
  try {
    let user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) throw new Error("employee not exists");
    else {
      const updatedUser = await user.update(request.body);
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
