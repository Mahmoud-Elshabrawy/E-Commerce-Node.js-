const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const { default: slugify } = require("slugify");

const generateToken = (id) => {
  return jwt.sign({ id, ts: Date.now() }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};

exports.signUp = asyncHandler(async (req, res) => {
  // create user
  req.body.slug = slugify(req.body.name);
  const user = await User.create(req.body);
  // generate token
  const token = generateToken(user._id);
  res.status(201).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  // check if the password and email in the body
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Please provide correct email and password", 400));
  // check if the user exists and password matches
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // generate token
  const token = generateToken(user._id);
  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

exports.protect = asyncHandler(async (req, res, next) => {
  // 1) get token and check it
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // console.log(req.headers.authorization);
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("You are not logged in, Please log in", 401));
  }

  // 2) verify the token(no changes happens or token expires)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3) check if the user still exists
  const user = await User.findById(decoded.id);
  if (!user)
    return next(
      new AppError("The user belonging to this token doesn't exists", 401)
    );

  // 4) check if the user change the password after the toke created
  if (user.passwordChangedAfter(decoded.iat))
    return next(
      new AppError("User recently changed password!, Please login again.", 401)
    );
  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You don't have permission to perform this action", 403)
      );
    }
    next();
  };
};
