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
  .route('/')
  .get(subCategoryController.getSubCategories)
  .post(createSubCategoryValidator, subCategoryController.createSubCategory);


router
  .route('/:id')
  .get(getSubCategoryValidator, subCategoryController.getSubCategory)
  .patch(updateSubCategoryValidator, subCategoryController.updateSubCategory)
  .delete(deleteSubCategoryValidator, subCategoryController.deleteSubCategory)

module.exports = router;
