const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const asyncHandler = require("express-async-handler");

const AppError = require("../utils/appError");
const Product = require("../models/productModel");
const factory = require("./handlersFactory");
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

exports.uploadProductImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizeImg = asyncHandler(async (req, res, next) => {
  if (!req.files) {
    return next();
  }

  // 1) image processing for image cover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);
    req.body.imageCover = imageCoverFileName;
  }

  // 2) image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, idx) => {
        const filename = `product-${uuidv4()}-${idx + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(600, 600)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${filename}`);
        req.body.images.push(filename);
      })
    );
  }
  next();
});

exports.getProducts = factory.getAll(Product);

exports.getProduct = factory.getOne(Product);

exports.createProduct = factory.createOne(Product);

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);
