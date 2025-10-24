const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: [true, 'Product must be unique'],
        trim: true,
        minlength: [3, 'Too short product title'],
        maxlength: [60, 'Too long product title']
    },
    slug: {
        type: String,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, 'Product Description required'],
        minlength: [20, 'Too short product description'],
    },
    price: {
        type: Number,
        required: [true, 'product price required'],
        trim: true
    },
    priceAfterDiscount: Number
    ,
    quantity: {
        required: [true, 'product quantity required'],
        type: Number
    },
    sold: {
        type: Number,
        default: 0
    },
    colors: [String],
    imageCover: {
        type: String,
        required: [true, 'product must have an imageCover']
    },
    images: [String],
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Product must belong to Category']
    },
    subcategories:[{
        type: mongoose.Types.ObjectId,
        ref: 'SubCategory',
    }],
    brand: {
        type: mongoose.Types.ObjectId,
        ref: 'Brand',
    },
    ratingsAverage: {
        type: Number,
        min: [1, 'Rating must be above or equal 1.0'],
        max: [5, 'Rating must be below or equal 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

const ProductModel = mongoose.model('Product', productSchema)
module.exports = ProductModel