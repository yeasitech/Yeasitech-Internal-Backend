const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const{ uuid} = require("uuidv4");
 
const {
    UserLogin, User,
  } = require("../models/index");
  
 exports.userLoginTokenGenerate = async (request, response) => {
  
      const token = uuid();
       const userId = request.body.userId;

    try {
      if (!userId || userId.length < 0) {
        response.status(500).json({ ack: 0, msg: `invalid userId ` });
      } else {
        const userLoginData = await UserLogin.create({userId,token});
      // console.log("expense",{...expenseData});
        response.status(200) .json({ ack: 1, msg: "link generated successfully", data: userLoginData });
      }
    } catch (error) {
      response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
    }
 };

 exports.resetPassword = async (request,response)=> {
    try {
        //const { password } =request.body;
        const token =request.params.token
        const userData = await UserLogin.findOne({ where :{token:token }});
        const password = bcrypt.hashSync(request.body.password, 10);
        if (!userData || userData.length < 0) {
          response.status(401).json({ ack: 0, msg: `Reset password link expired ` });
          return;
        } ;
       
        if ( new Date().getTime() - userData.createdAt.getTime() > 86400000 ){
            response.status(200).json({ ack: 1, msg: `Token expired ` });
            return;
            };

        if (password) {
           const  data= await User.update({password},{where :{id  :userData.userId}});
           await UserLogin.destroy({ where :{userId:userData.userId }});
           
            response
            .status(200)
            .json({ ack: 1, msg: "Successfully set password" });
        } 

      } catch (error) {
        response.status(500).json({ ack: 0, msg: error.message || `Server Error` });
      }
 };