const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: [true, "Product must be unique"],
      trim: true,
      minlength: [3, "Too short product title"],
      maxlength: [100, "Too long product title"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product Description required"],
      minlength: [20, "Too short product description"],
    },
    price: {
      type: Number,
      required: [true, "product price required"],
      trim: true,
    },
    priceAfterDiscount: Number,
    quantity: {
      required: [true, "product quantity required"],
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "product must have an imageCover"],
    },
    images: [String],
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to Category"],
    },
    subcategories: [
      {
        type: mongoose.Types.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Types.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
  }
);

// Virtual Populate for all reviews on product
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id'
})

// Query Middleware
productSchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name" });
  next();
});

const setImageCoverUrl = (doc) => {
  if (doc.imageCover) {
    const imageCoverUrl = `${process.env.baseUrl}/products/${doc.imageCover}`;
    doc.imageCover = imageCoverUrl;
  }
  if (doc.images && Array.isArray(doc.images)) {
    doc.images = doc.images.map(
      (img) => `${process.env.baseUrl}/products/${img}`
    );
  }
};

productSchema.pre("init", function (doc) {
  setImageCoverUrl(doc);
});

productSchema.pre("save", function () {
  setImageCoverUrl(this);
});

const ProductModel = mongoose.model("Product", productSchema);
module.exports = ProductModel;
