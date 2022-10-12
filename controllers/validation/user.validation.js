const Joi = require("joi");
const createEmployeeSchema = Joi.object({
  firstName: Joi.string().max(30).required().label("First Name"),
  middleName: Joi.string().max(30).label("Middle Name").min(0),
  lastName: Joi.string().max(30).required().label("Last Name"),
  dateOfJoining: Joi.string().max(30).required().label("Date Of Joining"),
  department: Joi.number().max(30).required().label("department"),
  designation: Joi.string().max(30).required().label("Designation"),
  employeeType: Joi.string().max(30).required().label("Employee Type"),
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
  password: Joi.string().label("password"),
});
const employeeDetailsSchema = Joi.object({
  email: Joi.string().required().email({ minDomainSegments: 2 }).label("Email"),
});
module.exports = { createEmployeeSchema, loginSchema, employeeDetailsSchema };
