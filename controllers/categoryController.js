const Category = require("../models/categoryModel");
const AppError = require("../utils/appError");
const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const storage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please provides only images"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: multerFilter });
exports.uploadCategoryImage = upload.single("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const filename = `category-${uuidv4()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`);
  req.body.image = filename;
  next();
});

exports.getCategories = factory.getAll(Category);

exports.getCategory = factory.getOne(Category);

exports.createCategory = factory.createOne(Category);

exports.updateCategory = factory.updateOne(Category);

exports.deleteCategory = factory.deleteOne(Category);
