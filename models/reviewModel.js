const mongoose = require("mongoose");

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

module.exports = mongoose.model("Review", reviewSchema);
