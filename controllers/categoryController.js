const Category = require("../models/categoryModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

// @desc Get List of Categories
// @route GET /api/v1/categories
// @access Public
exports.getCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 3;
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
exports.getCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const category = await Category.findById({ _id: id });
  if (!category) {
    return res.status(404).json({
      msg: "No category found with this ID",
    });
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
exports.updateCategory = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name, slug: slugify(name) },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!category) {
    return res.status(404).json({
      msg: "No Category found with this ID",
    });
  }
  res.status(200).json({
    status: "success",
    data: category,
  });
});

// @desc Delete Category
// @route DELETE /api/v1/categories/:id
// @access Private
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
   if (!category) {
    return res.status(404).json({
      msg: "No Category found with this ID",
    });
    }
    res.status(204).json({
        status: 'success',
        data: null
    })
});
