const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const { default: slugify } = require("slugify");
const sendEmail = require("../utils/email");
const generateToken = require('../utils/generateToken')


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

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("there is no user with email Address", 404));
  }

  // 2) if user exists, generate hash random verification code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // save hashed reset code to db
  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  user.passwordResetVerified = false;
  await user.save();

  try {
    // 3) send the random verification code to the user via email
    const message = `Hi ${user.name},\n We received a request for reset the password on your E-Shop App Account. \n ${resetCode} \n Enter this code to complete the reset. \n thanks for helping us keep your account secure. \n The E-Shop App Team `;
    await sendEmail({
      to: user.email,
      subject: "Your Password Reset Code (Valid for 10 min)",
      message: message,
    });
  } catch (err) {
    // Error while sending email
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(
      new AppError(
        " There was an error sending the email. Try again later!",
        500
      )
    );
  }
  // if verification code correct, add password and confirm it

  res.status(200).json({
    status: "success",
    message: "Reset code send to email",
  });
});

exports.verifyResetPasswordCode = asyncHandler(async (req, res, next) => {
  // 1) find user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError("reset code is Invalid or Expired"));

  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({
    status: "success",
  });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  // get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError("There is no user with this email", 404));

  if (!user.passwordResetVerified) return next(new AppError("Reset code doesn't verified yet", 400));

  user.password = req.body.newPassword;

  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save()

  // generate new token after update the password
  const token = generateToken(user._id)
  res.status(200).json({
    status: 'success',
    token
  })
});
