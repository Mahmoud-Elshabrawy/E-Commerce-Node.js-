const express = require("express");

const {
  getLoggedUserWishList,
  addToWishList,
  removeFromWishList,
} = require("../controllers/wishListController");

const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router.route("/").get(protect, getLoggedUserWishList).post(protect, restrictTo("user"), addToWishList);
router.delete("/:id", protect, restrictTo("user"), removeFromWishList);

module.exports = router;
