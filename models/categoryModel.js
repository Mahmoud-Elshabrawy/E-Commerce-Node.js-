const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category required'],
        unique: [true, 'category must be unique'],
        minlength: [3, 'Too short category name'],
        maxlength: [20, 'Too long category name']
    },
    slug: {
        type: String,
        lowercase: true
    },
    image: String
}, {timestamps: true})


const setImgUrl = (doc) => {
    if(doc.image) {
        const imgUrl = `${process.env.baseUrl}/categories/${doc.image}`;
        doc.image = imgUrl
    }
}
CategorySchema.pre('init', function(doc) {
    setImgUrl(doc)
})
CategorySchema.pre('save', function () {
    setImgUrl(this)
})

const CategoryModel = mongoose.model('Category', CategorySchema)
module.exports = CategoryModel