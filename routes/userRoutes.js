const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updatePassword,
  uploadUserProfileImg,
  resizeImage,
} = require("../controllers/userController");

const {
  getUserValidator,
  createUserValidator,
  deleteUserValidator,
  updateUserValidator,
  updatePasswordValidator,
} = require("../utils/validators/userValidators");

const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router.patch("/updatePassword/:id", updatePasswordValidator, updatePassword);


router
  .route("/")
  .get(protect, restrictTo("admin", "manager"), getUsers)
  .post(
    protect,
    restrictTo("admin"),
    uploadUserProfileImg,
    resizeImage,
    createUserValidator,
    createUser
  );
  
router
  .route("/:id")
  .get(protect, restrictTo("admin"), getUserValidator, getUser)
  .patch(
    protect,
    restrictTo("admin"),
    uploadUserProfileImg,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(protect, restrictTo("admin"), deleteUserValidator, deleteUser);

module.exports = router;
