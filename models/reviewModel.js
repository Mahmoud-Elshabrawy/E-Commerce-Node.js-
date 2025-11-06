const mongoose = require("mongoose");
const Product = require("./productModel");

const reviewSchema = new mongoose.Schema(
  {
    title: String,
    ratings: {
      type: Number,
      min: [1, "min ratings is 1.0"],
      max: [5, "max ratings i  5.0"],
      required: [true, "Review ratings required"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "review must belong to a user"],
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: [true, "review must belong to a product"],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

reviewSchema.statics.calculateRatingsAvg = async function (productId) {
  const result = await this.aggregate([
    // get all reviews in specific product (productId)
    {
      $match: { product: productId },
    },
    //
    {
      $group: {
        _id: "$product",
        ratingsAvg: { $avg: "$ratings" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);
  // update ratingsAverage, ratingsQuantity in Product Model
  if (result) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].ratingsAvg,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calculateRatingsAvg(this.product);
});

// pre middleware for get productId before update | delete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // Query Middleware (this refers to query)
  this.doc = await this.model.findOne(this.getQuery());
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.doc.constructor.calculateRatingsAvg(this.doc.product);
});

module.exports = mongoose.model("Review", reviewSchema);
