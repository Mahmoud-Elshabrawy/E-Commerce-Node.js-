const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updatePassword,
  uploadUserProfileImg,
  resizeImage
} = require("../controllers/userController");
const {
  getUserValidator,
  createUserValidator,
  deleteUserValidator,
  updateUserValidator,
  updatePasswordValidator
} = require("../utils/validators/userValidators");

const router = express.Router();

router.route("/").get(getUsers).post(uploadUserProfileImg, resizeImage, createUserValidator, createUser);
router.patch('/updatePassword/:id', updatePasswordValidator, updatePassword)
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .patch(uploadUserProfileImg, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
