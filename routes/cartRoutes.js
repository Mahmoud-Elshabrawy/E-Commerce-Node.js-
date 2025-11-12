const express = require("express");
const {
  addProductToCart,
  getLoggedUserCart,
  removeCartItem,
  removeAllCartItems,
  updateCartItemQuantity,
  applyCoupon,
} = require("../controllers/cartController");

const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router.use(protect, restrictTo("user"));

router
  .route("/")
  .get(getLoggedUserCart)
  .post(addProductToCart)
  .delete(removeAllCartItems);

router.patch("/applyCoupon", applyCoupon);

router.route("/:id").delete(removeCartItem).patch(updateCartItemQuantity);

module.exports = router;
