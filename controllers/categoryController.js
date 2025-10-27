const Category = require("../models/categoryModel");
const factory = require('./handlersFactory')

exports.getCategories = factory.getAll(Category)

exports.getCategory = factory.getOne(Category)

exports.createCategory = factory.createOne(Category)


exports.updateCategory = factory.updateOne(Category)


exports.deleteCategory = factory.deleteOne(Category)
