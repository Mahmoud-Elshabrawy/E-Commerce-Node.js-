const express = require("express");
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
// const {
//   getBrandValidator,
//   createBrandValidator,
//   deleteBrandValidator,
//   updateBrandValidator,
// } = require("../utils/validators/brandValidators");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(getReviews)
  .post(
    protect,
    restrictTo("user"),
    createReview
  );

router
  .route("/:id")
  .get( getReview)
  .patch(
    protect,
    restrictTo("user"),
    updateReview
  )
  .delete(protect, restrictTo('admin', 'manager', 'user'), deleteReview);

module.exports = router;
