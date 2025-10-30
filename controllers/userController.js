const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const factory = require("./handlersFactory");
const {uploadSingleImage} = require('../middlewares/uploadImage')
const User = require("../models/userModel");

exports.uploadUserProfileImg = uploadSingleImage('profileImg')

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
  req.body.image = filename;
  next();
});


exports.getUsers = factory.getAll(User)
exports.getUser = factory.getOne(User)
exports.createUser = factory.createOne(User)
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)