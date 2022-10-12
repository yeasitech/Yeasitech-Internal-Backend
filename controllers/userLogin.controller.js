const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { uuid } = require("uuidv4");

const { UserLogin, User } = require("../models");

exports.userLoginTokenGenerate = async (request, response) => {
  // const token = jwt.sign(
  //     { id: request.userId },
  //     process.env.SECRET_KEY,
  //     {
  //       algorithm: process.env.JWT_ALGORITHM,
  //       expiresIn: process.env.JWT_EXPIRE,
  //     }
  //   );
  const token = uuid();
  const userId = request.body.userId;

  try {
    if (!userId || userId.length < 0) {
      response.status(500).json({ ack: 0, msg: `invalid userId ` });
    } else {
      const userLoginData = await UserLogin.create({ userId, token });
      response
        .status(200)
        .json({ ack: 1, msg: "successfully added data", data: userLoginData });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};

exports.resetPassword = async (request, response) => {
  try {
    //const { password } =request.body;
    const token = request.params.token;
    const password = bcrypt.hashSync(request.body.password, 10);
    if (!token || token.length < 0) {
      response.status(500).json({ ack: 0, msg: `invalid token ` });
      return;
    }
    const userData = await UserLogin.findOne({ where: { token: token } });

    if (new Date().getTime() - userData.createdAt.getTime() > 86400000) {
      response.status(500).json({ ack: 0, msg: `Token expired ` });
      return;
    }

    if (password) {
      const data = await User.update(
        { password },
        { where: { id: userData.userId } }
      );
      response.status(200).json({ ack: 1, msg: "successfully set password" });
    }
  } catch (error) {
    response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
  }
};
