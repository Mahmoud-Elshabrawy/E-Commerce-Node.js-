const express = require("express");
const subCategoryController = require("../controllers/subCategoryController");
const {
  getSubCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidators");
const {setCategoryIdToBody} = require('../controllers/subCategoryController')

const router = express.Router({mergeParams: true});

router
  .route('/')
  .get(subCategoryController.getSubCategories)
  .post(setCategoryIdToBody, createSubCategoryValidator, subCategoryController.createSubCategory);


router
  .route('/:id')
  .get(getSubCategoryValidator, subCategoryController.getSubCategory)
  .patch(updateSubCategoryValidator, subCategoryController.updateSubCategory)
  .delete(deleteSubCategoryValidator, subCategoryController.deleteSubCategory)

module.exports = router;
