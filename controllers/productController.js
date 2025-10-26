const Product = require("../models/productModel");
const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const qs = require('qs')


exports.getProducts = asyncHandler(async (req, res) => {
  // 1) Filtration
  const queryStringObj = qs.parse(req.query)
  const excludedFields = ["page", "sort", "limit", "fields", "keyword"];
  excludedFields.forEach((el) => delete queryStringObj[el]);

  // Apply filtering using [gt, gte, lt, lte]
  let queryStr = JSON.stringify(queryStringObj)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g , match => `$${match}`)
  
  // 2) Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  
  // Build Query
  let Query = Product.find(JSON.parse(queryStr))
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name -_id" });
    
    
    // 3) Sorting
    if (req.query.sort) {
      let sortBy = req.query.sort.split(',').join(' ')
      
      console.log(sortBy);
      
      Query = Query.sort(sortBy)
    } else {
      Query = Query.sort('-createdAt')
    }
    
    // 4) Field Limiting
    if(req.query.fields) {
    let fields = req.query.fields.split(',').join(' ')
    Query = Query.select(fields)
  } else {
    Query = Query.select('-__v')
  }
  
  // 5) Search
  if(req.query.keyword) {
    let keyword = {}
    keyword.$or = [
      {name: {$regex: req.query.keyword, $options: 'i'}},
      {description: {$regex: req.query.keyword, $options: 'i'}}
    ]
    Query = Query.find(keyword)
  }

  // Execute Query
  const products = await Query
  
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
