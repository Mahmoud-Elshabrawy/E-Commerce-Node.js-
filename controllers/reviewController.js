
const factory = require("./handlersFactory");
const Review = require("../models/reviewModel");



exports.getReviews = factory.getAll(Review);

exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
