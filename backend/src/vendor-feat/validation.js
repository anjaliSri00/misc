const { body, query, param } = require("express-validator");

const validateCreateVendorDetails = [
  body("gst_details").notEmpty().withMessage("gst_details is required"),
  body("pan_details").notEmpty().withMessage("pan_details is required"),
  body("address").notEmpty().isString().withMessage("address is required"),
  body("std_code_with_phone")
    .optional()
    .isString()
    .withMessage("std_code_with_phone must be a string"),
  body("contact_person_name")
    .notEmpty()
    .isString()
    .withMessage("contact_person_name is required"),
  body("items_interested")
    .notEmpty()
    .isArray()
    .withMessage("items_interested must be an array"),
  body("city").optional().isString(),
  body("fax").optional().isString(),
  body("contact_person_designation").optional().isString(),
  body("state").notEmpty().isString().withMessage("state is required"),
  body("website").optional().isString(),
  body("is_msme").notEmpty().withMessage("is_msme is required"),
  body("country").notEmpty().isString().withMessage("country is required"),
  body("mobile").notEmpty().isString().withMessage("mobile is required"),
  body("business_description").optional().isString(),
  body("pin").notEmpty().isString().withMessage("pin is required"),
  body("email")
    .notEmpty()
    .isEmail()
    .withMessage("email is required and must be valid"),
  body("msme_certificate")
    .if(body("is_msme").equals("true"))
    .notEmpty()
    .withMessage("msme_certificate is required when is_msme is true"),
  body("experience_and_reference").optional().isString(),
  body("company_profile")
    .notEmpty()
    .isString()
    .withMessage("company_profile is required"),
  body("work_order_copies")
    .optional()
    .isArray()
    .withMessage("work_order_copies must be an array"),
  body("project_images")
    .optional()
    .isArray()
    .withMessage("project_images must be an array"),
  body("company_financial")
    .notEmpty()
    .isArray({ min: 3, max: 3 })
    .withMessage("company_financial must be an array of three objects"),
  body("company_financial.*.turnover")
    .notEmpty()
    .isString()
    .withMessage("Each company_financial entry must have a turnover string"),
  body("company_financial.*.year")
    .notEmpty()
    .isString()
    .withMessage("Each company_financial entry must have a year string"),
  body("bank_name").notEmpty().isString().withMessage("bank_name is required"),
  body("account_number")
    .notEmpty()
    .isString()
    .withMessage("account_number is required"),
  body("ifsc_code").notEmpty().isString().withMessage("ifsc_code is required"),
  body("cancelled_cheque_copy")
    .notEmpty()
    .isString()
    .withMessage("cancelled_cheque_copy is required"),
  body("company_certificate")
    .optional()
    .isString()
    .withMessage("company_certificate must be a string"),
];

const validateVendorList = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be a positive integer between 1 and 100"),
  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("search must be a string with maximum 100 characters"),
  query("state")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 50 })
    .withMessage("state must be a string with maximum 50 characters"),
  query("city")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 50 })
    .withMessage("city must be a string with maximum 50 characters"),
  query("is_msme")
    .optional()
    .isIn(["true", "false"])
    .withMessage("is_msme must be either 'true' or 'false'"),
  query("country")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 50 })
    .withMessage("country must be a string with maximum 50 characters"),
];

const validateVendorDetails = [
  param("vendor_id")
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("vendor_id must be a positive integer"),
];

module.exports = {
  validateCreateVendorDetails,
  validateVendorList,
  validateVendorDetails,
};
