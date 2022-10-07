const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
 
const {
    UserLoginModel,User,
  } = require("../models/index");
  
 exports.userLoginTokenGenerate = async (request, response) => {
    const token = jwt.sign(
        { id: request.userId },
        process.env.SECRET_KEY,
        {
          algorithm: process.env.JWT_ALGORITHM,
          expiresIn: process.env.JWT_EXPIRE,
        }
      );
       const userId = request.body.userId;

    try {
      if (!userId || userId.length < 0) {
        response.status(500).json({ ack: 0, msg: `invalid userId ` });
      } else {
        const userLoginData = await UserLoginModel.create({userId,token});
      // console.log("expense",{...expenseData});
        response.status(200) .json({ ack: 1, msg: "successfully added data", data: userLoginData });
      }
    } catch (error) {
      response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
    }
 };

 exports.resetPassword = async (request,response)=> {
    try {
        //const { password } =request.body;
        const userId =request.body.userId
        const password = bcrypt.hashSync(request.body.password, 10);
        if (!userId || userId.length < 0) {
          response.status(500).json({ ack: 0, msg: `invalid userId ` });
        } ;
        const userData = await UserLoginModel.findOne({ where :{userId :userId}});

        if ( new Date().getTime() - userData.createdAt.getTime() > 86400000 ){
            response.status(500).json({ ack: 0, msg: `Token expired ` });
            };

        if (password) {
           const  data= await User.update({password},{where :{id  :userId}});
            response
            .status(200)
            .json({ ack: 1, msg: "successfully set password" });
        } 

      } catch (error) {
        response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
      }
 };




 