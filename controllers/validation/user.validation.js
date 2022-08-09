const Joi = require("joi");
const signupSchema = Joi.object({
  fullName: Joi.string().max(30).required().label("Full Name"),
  password: Joi.string().required().label("Password"),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .label("Email"),
});
module.exports = { signupSchema };
