const Joi = require("joi");
const createEmployeeSchema = Joi.object({
  firstName: Joi.string().max(30).required().label("firstName"),
  middleName: Joi.string().max(30).label("middleName").min(0),
  lastName: Joi.string().max(30).required().label("lastName"),
  dateOfJoining: Joi.string().max(30).required().label("dateOfJoining"),
  department: Joi.string().max(30).required().label("department"),
  designation: Joi.string().max(30).required().label("designation"),
  employeeType: Joi.string().max(30).required().label("employeeType"),
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
