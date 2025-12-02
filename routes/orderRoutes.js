const express = require("express");

const {
  createCashOrder,
  getAllOrders,
  getOrder,
  getAllOrdersForLoggedUser,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkOutSession
} = require("../controllers/orderController");

const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router.use(protect);

router.get('/checkout-session/:id', restrictTo('user'), checkOutSession)

router
  .route("/")
  .get(
    restrictTo("admin", "manager", "user"),
    getAllOrdersForLoggedUser,
    getAllOrders
  )
  .post(restrictTo("user"), createCashOrder);

router.route("/:id").get(getOrder);
router.patch('/:id/pay', restrictTo('admin', 'manager'), updateOrderToPaid)
router.patch('/:id/deliver', restrictTo('admin', 'manager'), updateOrderToDelivered)

module.exports = router;
