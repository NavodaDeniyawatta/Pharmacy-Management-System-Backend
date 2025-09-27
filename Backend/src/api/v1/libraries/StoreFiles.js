// -------------------- Third party library and modules -------------------
const multer = require("multer");
const path = require("path");

// ---------------------- Define storege instance for files --------------------
const FileSettings = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// -------------------- Helper function to define fine storage ---------------------
const FileUpload = (field) => {
  const Upload = multer({ storage: FileSettings });

  return (req, res, next) => {
    Upload.single(field)(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          status: false,
          error: {
            message: "Failed to upload the file!",
          },
        });
      }
      next();
    });
  };
};

module.exports = { FileUpload };
