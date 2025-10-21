const express = require("express");
const categoryController = require("../controllers/categoryController");
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
  .post(createCategoryValidator, categoryController.createCategory);

router
  .route("/:id")
  .get(getCategoryValidator, categoryController.getCategory)
  .patch(updateCategoryValidator, categoryController.updateCategory)
  .delete(deleteCategoryValidator, categoryController.deleteCategory);

module.exports = router;
