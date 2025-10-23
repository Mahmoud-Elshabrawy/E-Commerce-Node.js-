const { check } = require('express-validator')
const validatorMiddleware = require('../../middlewares/validator')


exports.getProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product ID format'),
    validatorMiddleware.validator

]

exports.createProductValidator = [
    check('name').notEmpty().withMessage('Product required')
    .isLength({min: 3}).withMessage('Too short Product name')
    .isLength({max: 40}).withMessage('Too long Product name'),
    check('description').notEmpty().withMessage('Product Description required').isLength({min: 10}).withMessage('Too short product description'),
    check('price').notEmpty().withMessage('product price required').isNumeric().withMessage('product price must be Number'),
    check('quantity').notEmpty().withMessage('product quantity required').isNumeric().withMessage('product quantity must be Number'),
    check('sold').optional().withMessage('product '),
    validatorMiddleware.validator
]

exports.updateProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product ID format'),
    validatorMiddleware.validator
]

exports.deleteProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product ID format'),
    validatorMiddleware.validator
]