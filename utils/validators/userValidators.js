const bcrypt = require('bcryptjs');
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
    .withMessage("password must be at least 6 characters")
    .custom((val, { req }) => {
      if (val != req.body.passwordConfirm) {
        throw new Error("password and passwordConfirm doesn't match");
      }
      return true;
    }),
  check("passwordConfirm").notEmpty().withMessage("password confirm required"),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number"),
  ,
  validatorMiddleware.validator,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID format"),
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
    check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number"),
  ,
  validatorMiddleware.validator,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID format"),
  validatorMiddleware.validator,
];

exports.updatePasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User ID format"),

  // current password
  check("currentPassword")
    .notEmpty().withMessage("Current password required")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error(`No user found with this ID: ${req.params.id}`);
      }

      const isMatch = await bcrypt.compare(val, user.password);
      if (!isMatch) {
        throw new Error("Incorrect current password");
      }
      return true;
    }),

  // new password
  check("password")
    .notEmpty().withMessage("New password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  // confirm password
  check("confirmPassword")
    .notEmpty().withMessage("Confirm password required")
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),

  validatorMiddleware.validator,
];
