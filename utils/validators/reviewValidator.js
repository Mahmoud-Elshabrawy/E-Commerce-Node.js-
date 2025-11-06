const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator");
const Review = require("../../models/reviewModel");

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review ID format"),
  validatorMiddleware.validator,
];

exports.createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("Review ratings required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings value must be between 1 to 5"),
  check("user").isMongoId().withMessage("Invalid user ID format"),
  check("product").optional()
    .isMongoId()
    .withMessage("Invalid product ID format")
    .custom(async (val, { req }) => {
      // check if Logged user create review before

      const reviewExists = await Review.findOne({
        user: req.user._id,
        product: val,
      });
      if (reviewExists) {
        throw new Error(`Yor already created a Review on this product Before`);
      }
    }),
  validatorMiddleware.validator,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review ID format")
    .custom(async (val, { req }) => {
      // user updates only his reviews
      const review = await Review.findById(val);
      if (!review) throw new Error(`no Review found with this ID: ${val}`);
      if (review.user._id.toString() !== req.user._id.toString())
        throw new Error(`Yor not allowed to update this review`);
    }),

  validatorMiddleware.validator,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review ID format")
    .custom(async (val, { req }) => {
      // user deletes only his reviews and admin,manager delete any review
      const review = await Review.findById(val);
      if (!review) throw new Error(`no Review found with this ID: ${val}`);
      if (req.user.role === "user") {
        if (review.user._id.toString() !== req.user._id.toString())
          throw new Error(`You are not allowed to update this review`);
      }
    }),
  validatorMiddleware.validator,
];
