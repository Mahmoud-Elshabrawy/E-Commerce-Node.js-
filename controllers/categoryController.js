const Category = require("../models/categoryModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const { default: mongoose } = require("mongoose");


const checkId = (id) => {
  if(! mongoose.Types.ObjectId.isValid(id)) {
    return ne
  }
}
// @desc Get List of Categories
// @route GET /api/v1/categories
// @access Public
exports.getCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  const categories = await Category.find().skip(skip).limit(limit);
  res.status(200).json({
    status: "success",
    results: categories.length,
    data: categories,
  });
});

// @desc Get one Category
// @route GET /api/v1/categories/:id
// @access Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const category = await Category.findById( id );
  if (!category) {
    return next(new AppError(`No category found with this ID: ${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    data: category,
  });
});

// @desc Create Category
// @route POST /api/v1/categories
// @access Private
exports.createCategory = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  const category = await Category.create({ name, slug: slugify(name) });

  res.status(201).json({
    status: "success",
    data: category,
  });
});

// @desc Update Category
// @route PATCH /api/v1/categories/:id
// @access Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const name = req.body.name;
  const category = await Category.findByIdAndUpdate(
    id,
    { name, slug: slugify(name) },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!category) {
    return next(new AppError(`No category found with this ID: ${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    data: category,
  });
});

// @desc Delete Category
// @route DELETE /api/v1/categories/:id
// @access Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    return next(new AppError(`No category found with this ID: ${id}`, 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
