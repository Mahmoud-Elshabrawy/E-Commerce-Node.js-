const express = require("express");
const {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage
} = require("../controllers/brandController");
const {
  getBrandValidator,
  createBrandValidator,
  deleteBrandValidator,
  updateBrandValidator,
} = require("../utils/validators/brandValidators");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router.route("/").get(getBrands).post(protect,
    restrictTo('admin', 'manager'),uploadBrandImage, resizeImage, createBrandValidator, createBrand);

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .patch(protect,
    restrictTo('admin', 'manager'),uploadBrandImage, resizeImage, updateBrandValidator, updateBrand)
  .delete(protect,
    restrictTo('admin'),deleteBrandValidator, deleteBrand);

module.exports = router;
