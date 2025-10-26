const Product = require("../models/productModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const ApiFeatures = require("../utils/apiFeatures");

exports.getProducts = asyncHandler(async (req, res) => {
  const documentCounts = await Product.countDocuments()
  const features = new ApiFeatures(Product.find(), req.query)
    .paginate(documentCounts)
    .filter()
    .sort()
    .limitFields()
    .search()
    // .populate({ path: "category", select: "name -_id" });

  const {query, paginateResult} = features
  // Execute Query
  const products = await query;

  res.status(200).json({
    status: "success",
    results: products.length,
    paginateResult,
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
