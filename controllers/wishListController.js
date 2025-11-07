const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");


const User = require("../models/userModel");


exports.getLoggedUserWishList = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate({path: 'wishList', select: 'name'})
    res.status(200).json({
        status: 'success',
        data: user.wishList
    })
})

exports.addToWishList = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        $addToSet: {wishList: req.body.product}
    })

    res.status(200).json({
        status: 'success',
        message: 'product added to wishlist successfully.',
        data: user.wishList
    })
})


exports.removeFromWishList = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        $pull: {wishList: req.params.id}
    })

    res.status(200).json({
        status: 'success',
        message: 'product removed to wishlist successfully.',
        data: user.wishList
    })
})
