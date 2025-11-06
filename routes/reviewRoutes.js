const express = require("express");
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  setProductAndUserId,
  filterObj
} = require("../controllers/reviewController");
const {
  getReviewValidator,
  createReviewValidator,
  deleteReviewValidator,
  updateReviewValidator,
} = require("../utils/validators/reviewValidator");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router({mergeParams: true});

router
  .route("/")
  .get(filterObj, getReviews)
  .post(protect, restrictTo("user"), setProductAndUserId, createReviewValidator, createReview);

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
