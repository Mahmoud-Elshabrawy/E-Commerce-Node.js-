const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImage");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

exports.uploadUserProfileImg = uploadSingleImage("profileImg");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const filename = `user-${uuidv4()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/users/${filename}`);
  req.body.profileImg = filename;
  next();
});

exports.getUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.createUser = factory.createOne(User);

exports.updateUser = asyncHandler(async (req, res, next) => {
  // Prevent Update Password on this route
  if (req.body.password) {
    return next(
      new AppError(
        "This Route is Not for Password Update, Please Use Update Password Route",
        400
      )
    );
  }
  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }
  const document = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!document) {
    return next(
      new AppError(`No document found with this ID: ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    status: "success",
    data: document,
  });
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new AppError(`No user found with this ID: ${req.params.id}`, 404)
    );
  }
  user.password = req.body.password;
  user.passwordChangedAt = Date.now();
  await user.save();
  res.status(200).json({
    status: "success",
    data: user,
  });
});
exports.deleteUser = factory.deleteOne(User);
