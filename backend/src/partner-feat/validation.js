const { body, query, param } = require("express-validator");

const validateCreatePartner = [
  body("name").notEmpty().isString().withMessage("name is required"),
  body("mobile").notEmpty().isString().withMessage("mobile is required"),
  body("pan_number")
    .notEmpty()
    .isString()
    .withMessage("pan_number is required"),
  body("address").optional().isString(),
  body("city").notEmpty().isString().withMessage("city is required"),
  body("category_of_work")
    .notEmpty()
    .isArray()
    .withMessage("category_of_work must be an array"),
  body("category_of_work.*")
    .isString()
    .withMessage("Each category must be a string"),
  body("bank_name").notEmpty().isString().withMessage("bank_name is required"),
  body("account_number")
    .notEmpty()
    .isString()
    .withMessage("account_number is required"),
  body("ifsc_code").notEmpty().isString().withMessage("ifsc_code is required"),
];

const validatePartnerList = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("search").optional().isString().trim().isLength({ max: 100 }),
];

const validatePartnerDetails = [
  param("partner_id")
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage("partner_id must be a positive integer"),
];

module.exports = {
  validateCreatePartner,
  validatePartnerList,
  validatePartnerDetails,
};
