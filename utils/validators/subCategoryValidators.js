const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator");

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory ID format"),
  validatorMiddleware.validator,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory required")
    .isLength({ min: 2 })
    .withMessage("Too short SubCategory name")
    .isLength({ max: 20 })
    .withMessage("Too long SubCategory name"),
  check("category")
    .optional()
    ,
  validatorMiddleware.validator,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory ID format"),
  validatorMiddleware.validator,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid SubCategory ID format"),
  validatorMiddleware.validator,
];
