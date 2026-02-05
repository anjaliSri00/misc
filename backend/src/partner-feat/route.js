const express = require("express");
const {
  createPartner,
  getPartnerList,
  getPartnerDetails,
} = require("./controller");
const validate = require("../middlewares/validatorError");
const validationArray = require("./validation");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.post(
  "/partners",
  validate(validationArray.validateCreatePartner),
  createPartner
);

router.get(
  "/partners",
  authMiddleware,
  validate(validationArray.validatePartnerList),
  getPartnerList
);

router.get(
  "/partners/:partner_id",
  authMiddleware,
  validate(validationArray.validatePartnerDetails),
  getPartnerDetails
);

module.exports = router;
