const db = require("../models/index");
const jwt = require("jsonwebtoken");
const User = db.user;
const { signupSchema } = require("./validation/user.validation");
const bcrypt = require("bcryptjs");

//create new user

exports.createUser = async (request, response) => {
  const { error } = signupSchema.validate(request.body);
  if (error) {
    response.status(200).json({ ack: 1, msg: error.details[0].message });
    return;
  }
  const user = request.body;
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
        fullName: user.fullName,
        password: hash,
        email: user.email,
        username: user.username,
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
