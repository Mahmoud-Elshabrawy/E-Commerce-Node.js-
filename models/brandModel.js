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

const setImgUrl = (doc) => {
    if(doc.image) {
        const imgUrl = `${process.env.baseUrl}/categories/${doc.image}`;
        doc.image = imgUrl
    }
}
BrandSchema.pre('init', function(doc) {
    setImgUrl(doc)
})
BrandSchema.pre('save', function () {
    setImgUrl(this)
})


const BrandModel = mongoose.model('Brand', BrandSchema)
module.exports = BrandModel