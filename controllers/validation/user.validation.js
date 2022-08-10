const Joi = require("joi");
const signupSchema = Joi.object({
  firstName: Joi.string().max(30).required().label("firstName"),
  middleName: Joi.string().max(30).label("middleName").min(0),
  lastName: Joi.string().max(30).required().label("lastName"),
  // username: Joi.string().max(30).required().label("Last Name"),
  password: Joi.string().required().label("Password"),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .label("Email"),
});

const loginSchema = Joi.object({
  password: Joi.string(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .label("Email"),
});
module.exports = { signupSchema, loginSchema };
