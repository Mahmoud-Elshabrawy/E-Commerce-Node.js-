const express = require("express");

const {
  getLoggedUserAddress,
  addUserAddress,
  removeFromAddresses,
} = require("../controllers/addressController");

const {createAddressValidators} = require('../utils/validators/addressValidators')

const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router.route("/").get(protect, getLoggedUserAddress).post(protect, restrictTo("user"), createAddressValidators, addUserAddress);
router.delete("/:id", protect, restrictTo("user"), removeFromAddresses);

module.exports = router;
