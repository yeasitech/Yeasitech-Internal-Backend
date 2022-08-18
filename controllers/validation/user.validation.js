const Joi = require("joi");
const createEmployeeSchema = Joi.object({
  firstName: Joi.string().max(30).required().label("firstName"),
  middleName: Joi.string().max(30).label("middleName").min(0),
  lastName: Joi.string().max(30).required().label("lastName"),

  // password: Joi.string().label("Password"),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .label("Email"),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .label("Email"),
  password: Joi.string(),
});
const employeeDetailsSchema = Joi.object({
  email: Joi.string().required().email({ minDomainSegments: 2 }).label("Email"),
});
module.exports = { createEmployeeSchema, loginSchema, employeeDetailsSchema };
