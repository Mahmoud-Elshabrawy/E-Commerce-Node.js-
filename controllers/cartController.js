const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");

const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

const calcTotalCartPrice = (cart) => {
  let totalPrice = cart.cartItems.reduce((acc, cur) => {
    return (acc += cur.price * cur.quantity);
  }, 0);
  return (cart.totalCartPrice = totalPrice);
};

// Add Product to Cart
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  // get logged user cart
  let cart = await Cart.findOne({ user: req.user._id });
  const product = await Product.findById(req.body.product);
  if (!cart) {
    // create cart for logged user with product
    cart = await Cart.create({
      user: req.user._id,
      cartItems: { product, color: req.body.color, price: product.price },
    });
  } else {
    // if product already exists, update product quantity
    let productExists = await cart.cartItems.findIndex(
      (item) =>
        item.product.toString() === req.body.product &&
        item.color === req.body.color
    );

    if (productExists > -1) {
      cart.cartItems[productExists].quantity++;
    } else {
      // else push new product to cartItems
      cart.cartItems.push({
        product,
        color: req.body.color,
        price: product.price,
      });
    }
  }
  //   Calculate total cart price
  calcTotalCartPrice(cart);
  await cart.save();

  res.status(201).json({
    status: "success",
    message: "Product added to cart successfully",
    cart,
  });
});

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const userCart = await Cart.findOne({ user: req.user._id });

  if (!userCart) {
    return next(new AppError("No cart for this user", 404));
  }
  res.status(200).json({
    status: "success",
    cart: userCart,
  });
});

exports.removeCartItem = asyncHandler(async (req, res, next) => {
  // get user cart items and remove specific item
  let cart = await Cart.findOneAndUpdate(
    {user: req.user._id,},
    { $pull: { cartItems: { _id: req.params.id } }},
    { new: true }
  );
  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    cart,
  });
});
