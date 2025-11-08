const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validator");
const User = require("../../models/userModel");

exports.createAddressValidators = [
  check("alias")
    .notEmpty()
    .withMessage("alias required")
    .custom(async (val, { req }) => {
      // get user
      const user = await User.findById(req.user._id);
      const exists = user.addresses.some((address) => address.alias === val);
      if (exists) {
        throw new Error("This address exists, Please enter another alias");
      }
      return true;
    }),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number"),
  validatorMiddleware.validator,
];
