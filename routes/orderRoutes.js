const express = require('express')

const {createCashOrder} = require('../controllers/orderController')

const { protect, restrictTo } = require("../controllers/authController");


const router = express.Router()

router.use(protect, restrictTo('user'))

router.route('/').post(createCashOrder)

module.exports = router