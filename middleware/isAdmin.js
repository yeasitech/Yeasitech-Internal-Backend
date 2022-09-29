const jwt = require("jsonwebtoken");
const { User } = require("../models/index");

const isAdmin = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    console.log(`bearerToken`, bearerToken);
    //Verify token
    jwt.verify(bearerToken, process.env.SECRET_KEY, async (err, decoded) => {
      console.log("Decoded Data", decoded);
      if (err) {
        return res
          .status(403)
          .json({ msg: "You have no authorization to access this property." });
      }
      // req.userId = decoded.id;
      const user = await User.findByPk(decoded.id);
      console.log("User", user);
      if (!user || !user.dataValues.isAdmin) {
        return res
          .status(403)
          .json({ msg: "You have no authorization to access this property." });
      }
      req.userId = decoded.id;
      //Next middleware
      next();
    });
  } else {
    //Forbidden
    res
      .status(403)
      .json({ msg: "You have no authorization to access this property." });
  }
};

module.exports = isAdmin;
