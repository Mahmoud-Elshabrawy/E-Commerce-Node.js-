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

const router = express.Router();

router.route("/").get(getProducts).post(uploadProductImages, resizeImg, createProductValidator, createProduct);


router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .patch(uploadProductImages, resizeImg, updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;
