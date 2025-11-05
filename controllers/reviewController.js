const factory = require("./handlersFactory");
const Review = require("../models/reviewModel");

exports.setProductAndUserId = (req, res, next) => {
    // nested routes (productId/reviews)
  if (!req.body.product) {
    req.body.product = req.params.productId;
}

//   get logged in user
  if (!req.body.user && req.user) {
    req.body.user = req.user._id;
  }
  next();
};

exports.getReviews = factory.getAll(Review);

exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
