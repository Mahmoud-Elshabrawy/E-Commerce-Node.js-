const SubCategory = require("../models/subCategoryModel");
const factory = require('./handlersFactory')


exports.setCategoryId = (req, res, next) => {
  // nested routes (categoryId/subCategories)
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  console.log(req.body.category);
  

  next();
};

// Nested Routes (/categoryId/subCategories)
exports.filterObj = (req, res, next) => {
  let filter = {};
  if (req.params.categoryId) {
    filter = { category: req.params.categoryId };
  }

  req.filter = filter;
  next();
};

exports.getSubCategories = factory.getAll(SubCategory)

exports.getSubCategory = factory.getOne(SubCategory)

exports.createSubCategory = factory.createOne(SubCategory)

exports.updateSubCategory = factory.updateOne(SubCategory)

exports.deleteSubCategory = factory.deleteOne(SubCategory)
