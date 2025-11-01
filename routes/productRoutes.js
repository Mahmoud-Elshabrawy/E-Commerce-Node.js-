const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeImg
} = require("../controllers/productController");


const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidators");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router.route("/").get(getProducts).post(protect,
    restrictTo('admin', 'manager'),uploadProductImages, resizeImg, createProductValidator, createProduct);


router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .patch(protect,
    restrictTo('admin', 'manager'),uploadProductImages, resizeImg, updateProductValidator, updateProduct)
  .delete(protect,
    restrictTo('admin'),deleteProductValidator, deleteProduct);

module.exports = router;
