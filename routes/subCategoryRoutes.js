const express = require("express");
const subCategoryController = require("../controllers/subCategoryController");
const {
  getSubCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidators");

const router = express.Router();

router
  .route("/")
  .post(createSubCategoryValidator, subCategoryController.createSubCategory);

module.exports = router;
