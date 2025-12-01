const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");

const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require('../models/couponModel')



const calcTotalCartPrice = (cart) => {
  let totalPrice = cart.cartItems.reduce((acc, cur) => {
    return (acc += cur.price * cur.quantity);
  }, 0);
  return (cart.totalCartPrice = totalPrice);
};

// Add Product to Cart
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const productId = req.body.product;
  const color = req.body.color;

  const product = await Product.findById(productId);
  if (!product) return next(new AppError("Product not found", 404));

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: product._id,
          color,
          price: product.price,
          quantity: 1,
        },
      ],
    });
  } else {
    const itemIdx = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );

    if (itemIdx > -1) {
      cart.cartItems[itemIdx].quantity += 1;
    } else {
      cart.cartItems.push({
        product: product._id,
        color,
        price: product.price,
        quantity: 1,
      });
    }
  }

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
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.id } } },
    { new: true }
  );
  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    cart,
  });
});

exports.removeAllCartItems = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).json({});
});

exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart)
    return next(
      new AppError(`No cart found for this user: ${req.user._id}`, 404)
    );
  const itemIdx = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.id
  );


  if (itemIdx > -1) {
    cart.cartItems[itemIdx].quantity = quantity;
  } else {
    return next(new AppError(`No item found with id: ${req.params.id}`, 404));
  }

  calcTotalCartPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Cart item updated successfully",
    cart,
  });
});


exports.applyCoupon = asyncHandler(async (req, res, next) => {
  // get logged user cart
  let cart = await Cart.findOne({user: req.user._id})

  // get coupon and check validation
  let coupon = await Coupon.findOne({name: req.body.coupon, expire: {$gt: Date.now()}})

  if(!coupon) {
    return next(new AppError(`Coupon is invalid or expired`, 404))
  }

  // apply discount on totalCartPriceAfterDiscount
  cart.totalCartPriceAfterDiscount = (cart.totalCartPrice - ((coupon.discount / 100) * cart.totalCartPrice)).toFixed(2)
  await cart.save()

  res.status(200).json({
    status: 'success',
    cart
  })

})