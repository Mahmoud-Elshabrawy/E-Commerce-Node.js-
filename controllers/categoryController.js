
const CategoryModel = require('../models/categoryModel')

exports.getCategories = (req, res) => {
    const name = req.body.name

    const newCategory = new CategoryModel({name})
    newCategory.save().then((doc) => {
        res.json(doc)
    }).catch((err) => {
        console.log(err);
        
    })
}