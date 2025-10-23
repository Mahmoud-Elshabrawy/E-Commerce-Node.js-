const express = require("express");
const {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController");
const {
  getBrandValidator,
  createBrandValidator,
  deleteBrandValidator,
  updateBrandValidator,
} = require("../utils/validators/brandValidators");

const router = express.Router();

router.route("/").get(getBrands).post(createBrandValidator, createBrand);

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .patch(updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

module.exports = router;
