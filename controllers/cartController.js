const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");

const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// Add Product to Cart

exports.addProductToCart = asyncHandler(async (req, res, next) => {
  // get logged user cart
  let cart = await Cart.findOne({ user: req.user._id });
  const product = await Product.findById(req.body.product);
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: { product, color: req.body.color, price: product.price },
    });
  } else {
    console.log('user already has cart');
    
  }
});
