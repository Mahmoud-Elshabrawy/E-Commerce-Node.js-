const Brand = require("../models/brandModel");
const factory = require('./handlersFactory')


exports.getBrands = factory.getAll(Brand)


exports.getBrand = factory.getOne(Brand)
exports.createBrand = factory.createOne(Brand)
exports.updateBrand = factory.updateOne(Brand)

exports.deleteBrand = factory.deleteOne(Brand)