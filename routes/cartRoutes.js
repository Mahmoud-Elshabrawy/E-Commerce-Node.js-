const express = require("express");
const {
  addProductToCart,
  getLoggedUserCart,
  removeCartItem
} = require("../controllers/cartController");

const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router.use(protect, restrictTo("user"));

router.route("/").get(getLoggedUserCart).post(addProductToCart);

router.route('/:id').delete(removeCartItem)

module.exports = router;
