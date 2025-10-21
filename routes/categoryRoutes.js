const express = require('express')
const categoryController = require('../controllers/categoryController')
const {validateId} = require('../middlewares/validateId')
const router = express.Router()

router.route('/').get(categoryController.getCategories).post(categoryController.createCategory)

router.route('/:id')
.all(validateId).get(categoryController.getCategory).patch(categoryController.updateCategory).delete(categoryController.deleteCategory)

module.exports = router