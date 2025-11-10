const express = require("express");
const { addProductToCart } = require("../controllers/cartController");

const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router.use(protect);
router.route("/").post(restrictTo("user"), addProductToCart);

module.exports = router;
