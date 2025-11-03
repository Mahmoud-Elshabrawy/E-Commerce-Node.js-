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
  getLoggedUser,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUser
} = require("../controllers/userController");

const {
  getUserValidator,
  createUserValidator,
  deleteUserValidator,
  updateUserValidator,
  updatePasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/userValidators");

const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router.use(protect);


router.get("/getMe", getLoggedUser, getUser);
router.patch("/updateMyPassword", updateLoggedUserPassword);
router.patch("/updateMyData", updateLoggedUserValidator, updateLoggedUserData);
router.delete("/deleteMe", deleteLoggedUser);

router
  .route("/")
  .get(restrictTo("admin", "manager"), getUsers)
  .post(
    restrictTo("admin"),
    uploadUserProfileImg,
    resizeImage,
    createUserValidator,
    createUser
  );

router
  .route("/:id")
  .get(restrictTo("admin"), getUserValidator, getUser)
  .patch(
    restrictTo("admin"),
    uploadUserProfileImg,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(restrictTo("admin"), deleteUserValidator, deleteUser);
router.patch("/updatePassword/:id", updatePasswordValidator, updatePassword);

module.exports = router;
