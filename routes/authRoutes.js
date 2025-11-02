const express = require("express");
const { signUp, login, forgotPassword, verifyResetPasswordCode, resetPassword } = require("../controllers/authController");
const { signUpValidator, logInValidator } = require("../utils/validators/authValidators");

const router = express.Router();

router.post("/signup", signUpValidator, signUp);
router.post("/login", logInValidator, login);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyResetPassword", verifyResetPasswordCode);
router.patch("/resetPassword", resetPassword);


module.exports = router;
