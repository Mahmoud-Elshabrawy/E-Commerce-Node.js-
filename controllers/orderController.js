const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");

const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const factory = require('../controllers/handlersFactory')


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

exports.getAllOrdersForLoggedUser = asyncHandler(async (req, res, next) => {
  if(req.user.role === 'user') req.filter = {user: req.user._id}
  next()
})

exports.getAllOrders = factory.getAll(Order)

exports.getOrder = factory.getOne(Order)

exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
  if(!order) return next(new AppError(`no order found with this ID: ${req.params.id}`, 404))

  if(order.isPaid) return next(new AppError('Order is already paid', 400))

  order.isPaid = true
  order.paidAt = Date.now()
  await order.save()
  res.status(200).json({
    status: 'success',
    data: order
  })
})

exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
  if(!order) return next(new AppError(`no order found with this ID: ${req.params.id}`, 404))

  if(order.isDelivered) return next(new AppError('Order is already delivered', 400))

  order.isDelivered = true
  order.deliveredAt = Date.now()
  await order.save()
  res.status(200).json({
    status: 'success',
    data: order
  })
})