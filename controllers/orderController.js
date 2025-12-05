const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");

const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const factory = require("../controllers/handlersFactory");

exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const shippingPrice = 0;
  // get user cart
  const cart = await Cart.findOne({ user: req.user._id });
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
  if (order) {
    const bulkOpts = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOpts, {});

    // clear cart
    await Cart.findOneAndDelete({ user: req.user._id });
  }

  res.status(200).json({
    status: "success",
    data: order,
  });
});

exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order)
    return next(
      new AppError(`no order found with this ID: ${req.params.id}`, 404)
    );

  if (order.isPaid) return next(new AppError("Order is already paid", 400));

  order.isPaid = true;
  order.paidAt = Date.now();
  await order.save();
  res.status(200).json({
    status: "success",
    data: order,
  });
});

exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order)
    return next(
      new AppError(`no order found with this ID: ${req.params.id}`, 404)
    );

  if (order.isDelivered)
    return next(new AppError("Order is already delivered", 400));

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  await order.save();
  res.status(200).json({
    status: "success",
    data: order,
  });
});

exports.checkOutSession = asyncHandler(async (req, res, next) => {
  // get current order
  const cart = await Cart.findById(req.params.id);
  if (!cart) return next(new AppError("Cart not found", 404));

  // get cart price
  const totalPrice = cart.totalCartPriceAfterDiscount
    ? cart.totalCartPriceAfterDiscount
    : cart.totalCartPrice;

  const metadata = {
    cartId: cart._id.toString(),
    userId: req.user._id.toString(),
  };
  if (req.body && req.body.shippingAddress) {
    metadata.shippingAddress = JSON.stringify(req.body.shippingAddress);
  }
  // create checkout session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: cart._id.toString(),
    metadata,
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: req.user.name,
          },
          unit_amount: Math.round(totalPrice * 100),
        },
        quantity: 1,
      },
    ],

    // send session
  });
  res.status(200).json({
    status: "success",
    session,
  });
});

const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata.shippingAddress;
  const orderPrice = session.amount_total / 100;
  const cart = await Cart.findById(cartId);
  const user = await User.findOne({ email: session.customer_email });

  // create order with Card Payment
  const order = await Order.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAddress,
    totalOrderPrice: orderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethod: "card",
  });
  //   after creating order decrement product quantity and increment sold
  if (order) {
    const bulkOpts = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOpts, {});

    // clear cart
    await Cart.findByIdAndDelete(cartId);
  }
};

exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const signature = req.headers["stripe-signature"];
  let event;
  console.log(process.env.STRIPE_WEBHOOK_SECRET);
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`webhook error, ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    // console.log('create Order Here....');
    createCardOrder(event.data.object);
  }
  res.status(200).json({ received: true });
});

exports.getAllOrdersForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filter = { user: req.user._id };
  next();
});

exports.getAllOrders = factory.getAll(Order);

exports.getOrder = factory.getOne(Order);
