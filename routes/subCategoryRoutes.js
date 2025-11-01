const express = require("express");
const subCategoryController = require("../controllers/subCategoryController");
const {
  getSubCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidators");
const {setCategoryIdToBody} = require('../controllers/subCategoryController')
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router({mergeParams: true});

router
  .route('/')
  .get(subCategoryController.getSubCategories)
  .post(protect,
    restrictTo('admin', 'manager'),createSubCategoryValidator, subCategoryController.createSubCategory);


router
  .route('/:id')
  .get(getSubCategoryValidator, subCategoryController.getSubCategory)
  .patch(protect,
    restrictTo('admin', 'manager'),updateSubCategoryValidator, subCategoryController.updateSubCategory)
  .delete(protect,
    restrictTo('admin'),deleteSubCategoryValidator, subCategoryController.deleteSubCategory)

module.exports = router;
