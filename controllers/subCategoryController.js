const SubCategory = require("../models/subCategoryModel");
const AppError = require("../utils/appError");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

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
