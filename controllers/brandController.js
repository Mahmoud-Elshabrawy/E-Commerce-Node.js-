const Brand = require("../models/brandModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");


exports.getBrands = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  const brand = await Brand.find().skip(skip).limit(limit);
  res.status(200).json({
    status: "success",
    results: brand.length,
    data: brand,
  });
});


exports.getBrand = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const brand = await Brand.findById( id );
  if (!brand) {
    return next(new AppError(`No brand found with this ID: ${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    data: brand,
  });
});

exports.createBrand = asyncHandler(async (req, res, next) => {
  const name = req.body.name;
  const brand = await Brand.create({ name, slug: slugify(name) });

  res.status(201).json({
    status: "success",
    data: brand,
  });
});

exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const name = req.body.name;
  const brand = await Brand.findByIdAndUpdate(
    id,
    { name, slug: slugify(name) },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!brand) {
    return next(new AppError(`No Brand found with this ID: ${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    data: brand,
  });
});

exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) {
    return next(new AppError(`No brand found with this ID: ${id}`, 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});