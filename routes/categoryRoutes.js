const express = require("express");
const categoryController = require("../controllers/categoryController");
const subCategoryRoutes = require('./subCategoryRoutes')
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");


const router = express.Router();

router
  .route("/")
  .get(categoryController.getCategories)
  .post(categoryController.uploadCategoryImage, createCategoryValidator, categoryController.createCategory);

router.use('/:categoryId/subcategories', subCategoryRoutes)

router
  .route("/:id")
  .get(getCategoryValidator, categoryController.getCategory)
  .patch(updateCategoryValidator, categoryController.updateCategory)
  .delete(deleteCategoryValidator, categoryController.deleteCategory);

module.exports = router;
