const jwt = require("jsonwebtoken");

const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const { default: slugify } = require("slugify");

exports.signUp = asyncHandler(async (req, res) => {
  // create user
  req.body.slug = slugify(req.body.name)
  const user = await User.create(req.body);
  // generate token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
  res.status(201).json({
    status: "success",
    data: {
      user,
      token,
    },
  });
});
