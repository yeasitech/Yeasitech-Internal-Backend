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
  clientId: Joi.string().max(30).required().label("Client ID").min(0),
  companyName: Joi.string().optional().label("Company Name").min(0),
  birthday: Joi.date().optional().label("Birth Day").min(0),
  gender: Joi.string().optional().label("Gender").min(0),
  address: Joi.string().optional().label("Address").min(0),
  contactPerson: Joi.string().optional().label("Contact Person").min(0),
  designation: Joi.string().optional().label("Designation").min(0),
  profileImage: Joi.string().optional().label("Profile Image").min(0),
});
module.exports = {
  createClientSchema,
};
