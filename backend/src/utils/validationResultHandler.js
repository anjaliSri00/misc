// validationResultHandler.js
const { validationResult } = require("express-validator");
// Common function to handle validation results
const handleValidationResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next(); // Proceed to the next middleware if no validation errors
};

module.exports = handleValidationResults;
