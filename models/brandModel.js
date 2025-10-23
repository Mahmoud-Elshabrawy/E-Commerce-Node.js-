const mongoose = require('mongoose')

const BrandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Brand required'],
        unique: [true, 'Brand must be unique'],
        minlength: [2, 'Too short brand name'],
        maxlength: [20, 'Too long brand name']
    },
    slug: {
        type: String,
        lowercase: true
    },
    image: String
}, {timestamps: true})

const BrandModel = mongoose.model('Brand', BrandSchema)
module.exports = BrandModel