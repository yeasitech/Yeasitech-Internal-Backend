const userController = require("../controllers/user.controller");
const { Router } = require("express");
const userRouter = Router();

userRouter.post("/signup", userController.createUser);
module.exports = userRouter;
