const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator").validator;
const Category = require('../../models/categoryModel')
const SubCategory = require('../../models/subCategoryModel')


exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID format"),
  validatorMiddleware
];

exports.createProductValidator = [
  check("name")
    .notEmpty()
    .withMessage("Product required")
    .isLength({ min: 3 })
    .withMessage("Too short Product name")
    .isLength({ max: 60 })
    .withMessage("Too long Product name"),
  check("description")
    .notEmpty()
    .withMessage("Product Description required")
    .isLength({ min: 10 })
    .withMessage("Too short product description"),
  check("price")
    .notEmpty()
    .withMessage("product price required")
    .isNumeric()
    .withMessage("product price must be Number"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("product priceAfterDiscount must be Number")
    .toFloat()
    .custom((val, { req }) => {
      if (req.body.price <= val) {
        throw new Error('priceAfterDiscount must be lower than price')
      }
      return true;
    }),
  check("quantity")
    .notEmpty()
    .withMessage("product quantity required")
    .isNumeric()
    .withMessage("product quantity must be Number"),
  check("sold").optional(),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Colors must be array of string"),
  check("imageCover")
    .notEmpty()
    .withMessage("Product must have an Image Cover"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images must be array of string"),
  check("category")
    .notEmpty()
    .withMessage("Product must be belong to category")
    .isMongoId()
    .withMessage("Invalid Category ID format")
    .custom(async (categoryId) => {
        const category = await Category.findById(categoryId)
        if(!category) {
            throw new Error(`No Category for this ID: ${categoryId} in DB`)
        }
        return true
    }),
  check("subcategories").optional().isArray().withMessage('Subcategories must be an array of IDs').isMongoId().withMessage("Invalid subcategories ID format")
  .custom(async (subCategoriesIds) => {
    const subcategories = await SubCategory.find({_id: {$in: subCategoriesIds}})
    const existingIds = subcategories.map((sub) => sub._id.toString())
    const InvalId = subCategoriesIds.filter(id => !existingIds.includes(id))
    if(subcategories.length !== subCategoriesIds.length) {
        throw new Error(`No SubCategory for this ID: ${InvalId}  in DB`)
    }
    // Another Solution
    // await Promise.all(
    //     subCategoriesIds.map(async (id) => {
    //         const subCategory = await SubCategory.findById(id)
    //         if(!subCategory) {
    //             throw new Error(`No SubCategory for this ID: ${id} in DB`)
    //         }
    //         return true
    //     })
    // )
  }),
  check("brand").optional().isMongoId().withMessage("Invalid Product ID format"),
  check("ratingsAverage")
    .isNumeric()
    .withMessage("ratingsAverage must be Number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be Number"),

  validatorMiddleware
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID format"),
  validatorMiddleware
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID format"),
  validatorMiddleware
];
