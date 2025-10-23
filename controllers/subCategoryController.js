const SubCategory = require("../models/subCategoryModel");
const AppError = require("../utils/appError");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

exports.getSubCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  const subCategories = await SubCategory.find()
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name -_id" });
  res.status(200).json({
    status: "success",
    results: subCategories.length,
    data: subCategories,
  });
});

exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findById(id).populate({
    path: "category",
    select: "name",
  });
  if (!subCategory) {
    return next(new AppError(`No category found with this ID: ${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    data: subCategory,
  });
});

exports.createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    category,
  });

  res.status(201).json({
    status: "success",
    data: subCategory,
  });
});

exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const name = req.body.name;
  const subCategory = await SubCategory.findByIdAndUpdate(
    id,
    { name, slug: slugify(name) },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!subCategory) {
    return next(new AppError(`No SubCategory found with this ID: ${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    data: subCategory,
  });
});

exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findByIdAndDelete(id);
  if (!subCategory) {
    return next(new AppError(`No SubCategory found with this ID: ${id}`, 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
