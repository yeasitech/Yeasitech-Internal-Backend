const userController = require("../controllers/user.controller");
const { Router } = require("express");
const userRouter = Router();

userRouter.post("/signup", userController.createUser);
userRouter.post("/login", userController.logIn);
module.exports = userRouter;
