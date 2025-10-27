const Category = require("../models/categoryModel");
const AppError = require("../utils/appError");
const factory = require("./handlersFactory");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

// Upload to Disk Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/categories");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const filename = `category-${uuidv4()}.${ext}`;
    cb(null, filename);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please provides only images"), false);
  }
};

const upload = multer({ storage: storage , fileFilter: multerFilter});
exports.uploadCategoryImage = upload.single("image");

exports.getCategories = factory.getAll(Category);

exports.getCategory = factory.getOne(Category);

exports.createCategory = factory.createOne(Category);

exports.updateCategory = factory.updateOne(Category);

exports.deleteCategory = factory.deleteOne(Category);
