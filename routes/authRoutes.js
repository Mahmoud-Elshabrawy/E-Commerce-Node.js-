const express = require("express");
const { signUp, login } = require("../controllers/authController");
const { signUpValidator, logInValidator } = require("../utils/validators/authValidators");

const router = express.Router();

router.route("/signup").post(signUpValidator, signUp);
router.route("/login").post(logInValidator, login);


module.exports = router;
