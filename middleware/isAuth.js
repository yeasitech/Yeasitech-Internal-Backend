require("dotenv").config();
const jwt = require("jsonwebtoken");
//const config = require("../config/db.config");
//FORMAT OF TOKEN
//Authorization: Bearer <token>

const isAuthenticated = (request, response, next) => {
  const bearerHeader = request.headers["authorization"];
  console.log(`bearerHeader`, bearerHeader);
  request.timezone = request.headers["timezone"];
  //Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    //console.log("bearerToken", bearerToken);
    //Verify token
    jwt.verify(bearerToken, process.env.SECRET_KEY, (err, decoded) => {
      //console.log("Decoded Data", decoded);
      //console.log(`>>>>>>>>>`, process.env.SECRET_KEY);
      if (err) {
        return response
          .status(403)
          .json({ msg: "You have no authorization to access this property." });
      }
      request.userId = decoded.id;
      //Next middleware
      next();
    });
  } else {
    //Forbidden
    response
      .status(403)
      .json({ msg: "You have no authorization to access this property." });
  }
};
module.exports = isAuthenticated;
