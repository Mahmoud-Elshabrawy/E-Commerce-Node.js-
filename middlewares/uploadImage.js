const multer = require("multer");
const AppError = require("../utils/appError");

exports.uploadSingleImage = (img) => {
  const storage = multer.memoryStorage();

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError("Not an image! Please provides only images"), false);
    }
  };

  const upload = multer({ storage: storage, fileFilter: multerFilter });
  return upload.single(img);
};

