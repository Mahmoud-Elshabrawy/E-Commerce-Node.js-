const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category required'],
        unique: [true, 'category must be unique'],
        minlength: [3, 'Too short category name'],
        maxlength: [20, 'Too long category name']
    }
})

const CategoryModel = mongoose.model('Category', CategorySchema)
module.exports = CategoryModel