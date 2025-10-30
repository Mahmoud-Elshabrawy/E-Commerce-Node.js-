const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator");
const User = require("../../models/userModel");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID format"),
  validatorMiddleware.validator,
];

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name required")
    .isLength({ min: 3 })
    .withMessage("Too short user name"),
  check("email")
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("invalid email address")
    .custom(async (val) => {
      const exists = await User.findOne({ email: val });
      if (exists) {
        throw new Error(
          `this email address: ${val} already exists, please login`
        );
      }
    }),
  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number"),
  ,
  validatorMiddleware.validator,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID format"),
  validatorMiddleware.validator,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID format"),
  validatorMiddleware.validator,
];
