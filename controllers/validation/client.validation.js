const Joi = require("joi");
const createClientSchema = Joi.object({
  firstName: Joi.string().max(30).required().label("First Name"),
  lastName: Joi.string().max(30).required().label("Last Name"),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required()
    .label("Email"),
  phone: Joi.number().required().label("Phone Number"),
  companyName: Joi.string().optional().label("Company Name").min(0),
  gender: Joi.string().optional().label("Gender").min(0),
  address: Joi.string().optional().label("Address").min(0),
  contactPerson: Joi.string().optional().label("Contact Person").min(0),
  designation: Joi.string().optional().label("Designation").min(0),
  profileImage: Joi.string().optional().label("Profile Image").min(0),
});
const updateClientSchema = Joi.object({
  firstName: Joi.string().max(30).optional().label("First Name"),
  lastName: Joi.string().max(30).optional().label("Last Name"),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .optional()
    .label("Email"),
  phone: Joi.number().optional().label("Phone Number"),
  companyName: Joi.string().optional().label("Company Name").min(0),
  gender: Joi.string().optional().label("Gender").min(0),
  address: Joi.string().optional().label("Address").min(0),
  contactPerson: Joi.string().optional().label("Contact Person").min(0),
  designation: Joi.string().optional().label("Designation").min(0),
  profileImage: Joi.string().optional().label("Profile Image").min(0),
});
module.exports = {
  createClientSchema,
  updateClientSchema,
};
