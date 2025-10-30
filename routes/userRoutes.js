const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserProfileImg,
  resizeImage
} = require("../controllers/userController");
// const {
//   getBrandValidator,
//   createBrandValidator,
//   deleteBrandValidator,
//   updateBrandValidator,
// } = require("../utils/validators/brandValidators");

const router = express.Router();

router.route("/").get(getUsers).post(uploadUserProfileImg, resizeImage, createUser);

router
  .route("/:id")
  .get( getUser)
  .patch(uploadUserProfileImg, resizeImage, updateUser)
  .delete( deleteUser);

module.exports = router;
