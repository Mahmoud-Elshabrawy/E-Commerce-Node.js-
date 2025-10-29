const multer = require("multer");
const AppError = require("../utils/appError");

const multerOptions = () => {
  const storage = multer.memoryStorage();

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError("Not an image! Please provides only images"), false);
    }
  };
    const upload = multer({ storage: storage, fileFilter: multerFilter });
    return upload;
};

exports.uploadSingleImage = (img) => multerOptions().single(img);

exports.uploadMixOfImages = (arrayOfFields) => multerOptions().fields(arrayOfFields);
