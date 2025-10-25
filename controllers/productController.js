const Product = require("../models/productModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const qs = require('qs')


exports.getProducts = asyncHandler(async (req, res) => {
  const queryStringObj = qs.parse(req.query)
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryStringObj[el]);
  // Apply filtering using [gt, gte, lt, lte]
  let queryStr = JSON.stringify(queryStringObj)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g , match => `$${match}`)
  
  
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  const products = await Product.find(JSON.parse(queryStr))
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name -_id" });
  
    res.status(200).json({
    status: "success",
    results: products.length,
    data: products,
  });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findById(id).populate({
    path: "category",
    select: "name -_id",
  });
  if (!product) {
    return next(new AppError(`No product found with this ID: ${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    data: product,
  });
});

exports.createProduct = asyncHandler(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  const product = await Product.create(req.body);

  res.status(201).json({
    status: "success",
    data: product,
  });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }
  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return next(new AppError(`No product found with this ID: ${id}`, 404));
  }
  res.status(200).json({
    status: "success",
    data: product,
  });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return next(new AppError(`No product found with this ID: ${id}`, 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
