const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID format"),
  validatorMiddleware.validator,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand required")
    .isLength({ min: 2 })
    .withMessage("Too short brand name")
    .isLength({ max: 20 })
    .withMessage("Too long brand name"),
  validatorMiddleware.validator,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID format"),
  validatorMiddleware.validator,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID format"),
  validatorMiddleware.validator,
];
