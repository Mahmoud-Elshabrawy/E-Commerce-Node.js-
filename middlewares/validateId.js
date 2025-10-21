const mongoose = require('mongoose')
const AppError = require('../utils/appError')

exports.validateId = (req, res, next) => {
    const {id} = req.params
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError(`Invalid ID format: ${id}`,400))
    }
    next()
}