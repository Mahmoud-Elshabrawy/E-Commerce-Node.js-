const { check } = require('express-validator')
const validatorMiddleware = require('../../middlewares/validator')


exports.getCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Category ID format'),
    validatorMiddleware.validator

]

exports.createCategoryValidator = [
    check('name').notEmpty().withMessage('Category required')
    .isLength({min: 3}).withMessage('Too short category name')
    .isLength({max: 20}).withMessage('Too long category name'),
    validatorMiddleware.validator
]

exports.updateCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Category ID format'),
    validatorMiddleware.validator
]

exports.deleteCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Category ID format'),
    validatorMiddleware.validator
]