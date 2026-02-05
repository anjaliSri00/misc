const express = require("express");
const {
  loginController,
  createVendorDetails,
  getVendorList,
  getVendorDetails,
  getVendorFilters,
} = require("./controller");
const validate = require("../middlewares/validatorError");
const validationArray = require("./validation");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.post("/login", loginController);

router.post(
  "/vendor-details",
  validate(validationArray.validateCreateVendorDetails),
  createVendorDetails
);

router.get(
  "/vendor-list",
  authMiddleware,
  validate(validationArray.validateVendorList),
  getVendorList
);

router.get(
  "/vendor-details/:vendor_id",
  authMiddleware,
  validate(validationArray.validateVendorDetails),
  getVendorDetails
);

router.get(
  "/vendor-filters",
  authMiddleware,
  getVendorFilters
);

module.exports = router;
