const Joi = require("joi");
const clientInvoiceModel = require("../../models/clientInvoice.model");
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

const createClientInvoiceSchema = Joi.object({
  clientId: Joi.number().required().label("Client Id"),
  invoiceDate: Joi.date().required().label("Invoice Date"),
  dueDate: Joi.date().required().label("Due Date"),
  otherInfo: Joi.string().optional().label("Other Info").min(0),
});
const updateClientInvoiceSchema = Joi.object({
  item: Joi.string().optional().label(" Item").min(0),
  // description: Joi.string().optional().label("Description").min(0),
  dueDate: Joi.date().optional().label("Due Date").min(0),
  unitCost: Joi.number().optional().label("Unit Cost").min(0),
  quantity: Joi.number().optional().label("Quantity").min(0),
  amount: Joi.number().optional().label("Amount").min(0),
  status: Joi.string().optional().label("Status").min(0),
  otherInfo: Joi.string().optional().label("Other Info").min(0),
});
module.exports = {
  createClientSchema,
  updateClientSchema,
  updateClientInvoiceSchema,
  createClientInvoiceSchema,
};
