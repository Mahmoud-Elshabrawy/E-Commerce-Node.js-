const express = require("express");
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const {
  getReviewValidator,
  createReviewValidator,
  deleteReviewValidator,
  updateReviewValidator,
} = require("../utils/validators/reviewValidator");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(getReviews)
  .post(protect, restrictTo("user"), createReviewValidator, createReview);

router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .patch(protect, restrictTo("user"), updateReviewValidator, updateReview)
  .delete(
    protect,
    restrictTo("admin", "manager", "user"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
