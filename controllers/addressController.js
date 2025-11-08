const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");


const User = require("../models/userModel");


exports.getLoggedUserAddress= asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate({path: 'addresses'})
    res.status(200).json({
        status: 'success',
        data: user.addresses
    })
})

exports.addUserAddress = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        $addToSet: {addresses: req.body}
    }, {new: true})

    res.status(200).json({
        status: 'success',
        message: 'Address added to User successfully.',
        data: user.addresses
    })
})


exports.removeFromAddresses = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        $pull: {addresses: {_id :req.params.id}}
    })

    res.status(200).json({
        status: 'success',
        message: 'Address removed successfully.',
    })
})
