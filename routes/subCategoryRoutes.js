const express = require("express");
const {
  getSubCategories,
  getSubCategory,
  createSubCategory,
  deleteSubCategory,
  updateSubCategory,
  setCategoryId,
  filterObj,
} = require("../controllers/subCategoryController");
const {
  getSubCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidators");

const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(filterObj, getSubCategories)
  .post(
    protect,
    restrictTo("admin", "manager"),
    createSubCategoryValidator,
    setCategoryId,
    createSubCategory
  );

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .patch(
    protect,
    restrictTo("admin", "manager"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    protect,
    restrictTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
