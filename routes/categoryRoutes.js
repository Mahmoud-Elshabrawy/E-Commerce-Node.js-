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

const router = express.Router();

router
  .route("/")
  .get(getCategories)
  .post(
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
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
