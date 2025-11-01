const express = require("express");
const subCategoryRoutes = require("./subCategoryRoutes");
const {
  getCategories,
  createCategory,
  getCategory,
  deleteCategory,
  updateCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../controllers/categoryController");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(getCategories)
  .post(
    protect,
    restrictTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );

router.use("/:categoryId/subcategories", subCategoryRoutes);

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .patch(
    protect,
    restrictTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    protect,
    restrictTo("admin"),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
