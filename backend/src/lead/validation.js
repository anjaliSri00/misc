const { body, query, param } = require("express-validator");

const validateCreateLead = [
  body("interior_service")
    .notEmpty()
    .isString()
    .isIn(['office', 'retail', 'F & B', 'other'])
    .withMessage("interior_service is required and must be one of: office, retail, F & B, other"),
  
  body("type_of_project")
    .notEmpty()
    .isString()
    .isIn(['new property', 'renovation property', 'other'])
    .withMessage("type_of_project is required and must be one of: new property, renovation property, other"),
  
  body("property_size")
    .notEmpty()
    .isString()
    .withMessage("property_size is required"),
  
  body("budget")
    .notEmpty()
    .isString()
    .withMessage("budget is required"),
  
  body("hiring_decision")
    .notEmpty()
    .isString()
    .withMessage("hiring_decision is required"),
  
  body("city")
    .notEmpty()
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("city is required and must be between 2-100 characters"),
  
  body("name")
    .notEmpty()
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("name is required and must be between 2-100 characters"),
  
  body("email")
    .notEmpty()
    .isEmail()
    .normalizeEmail()
    .withMessage("email is required and must be a valid email address"),
  
  body("mobile")
    .notEmpty()
    .isString()
    .matches(/^[6-9][0-9]{9}$/)
    .withMessage("mobile is required and must be a valid 10-digit Indian mobile number"),
  
  body("marketingOptIn")
    .optional()
    .isBoolean()
    .withMessage("marketingOptIn must be a boolean value")
];

const validateGetLeads = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be between 1 and 100"),

  query("interior_service")
    .optional()
    .isString()
    .isIn(['office', 'retail', 'F & B', 'other'])
    .withMessage("interior_service must be one of: office, retail, F & B, other"),

  query("type_of_project")
    .optional()
    .isString()
    .isIn(['new property', 'renovation property', 'other'])
    .withMessage("type_of_project must be one of: new property, renovation property, other"),

  query("city")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("city must be between 2-100 characters"),

  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("search must be less than 100 characters"),

  query("start_date")
    .optional()
    .isISO8601()
    .withMessage("start_date must be a valid date"),

  query("end_date")
    .optional()
    .isISO8601()
    .withMessage("end_date must be a valid date")
];

const validateGetLeadById = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("lead ID must be a positive integer")
];

module.exports = {
  validateCreateLead,
  validateGetLeads,
  validateGetLeadById
};
