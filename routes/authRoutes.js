const express = require("express");
const { signUp } = require("../controllers/authController");
const { signUpValidator } = require("../utils/validators/authValidators");

const router = express.Router();

router
  .route("/signup")
  // .get(getUsers)
  .post(signUpValidator, signUp);
// router.patch("/updatePassword/:id", updatePasswordValidator, updatePassword);
// router
//   .route("/:id")
//   .get(getUserValidator, getUser)
//   .patch(uploadUserProfileImg, resizeImage, updateUserValidator, updateUser)
//   .delete(deleteUserValidator, deleteUser);

module.exports = router;
