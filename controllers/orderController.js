const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");

const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");

exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const shippingPrice = 0;
  // get user cart
  const cart = await Cart.findOne({user: req.user._id});
  if (!cart) {
    return next(
      new AppError(`There is no cart for this user ID: ${req.user._id}`, 404)
    );
  }

  // get cart price and check if there is discount
  const totalOrderPrice =
    (cart.totalCartPriceAfterDiscount
      ? cart.totalCartPriceAfterDiscount
      : cart.totalCartPrice) + shippingPrice;

  // create new order with default payment (cash)
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });

  //   after creating order decrement product quantity and increment sold
  if(order) {
    const bulkOpts = cart.cartItems.map((item) => ({
        updateOne: {
            filter: {_id: item.product},
            update: {$inc: {quantity: -item.quantity, sold: +item.quantity}}
        }
    }))
    await Product.bulkWrite(bulkOpts, {})

    // clear cart
    await Cart.findOneAndDelete({user: req.user._id})
  }

  res.status(200).json({
    status: 'success',
    data: order
  })
});
