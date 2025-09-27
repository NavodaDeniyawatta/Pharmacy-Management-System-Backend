// -------------------- Third party libraries and modules --------------------
const fs = require("fs");
const path = require("path");

// ---------- Function to save file to storage ----------
const SaveFile = async (req, res) => {
  try {
    const File = req.file;

    console.log("Saving function call");
    console.log(File);

    // check file already exsist or not
    if (!File) {
      return res.status(404).json({
        status: false,
        error: {
          message: "There is no any file to store.",
        },
      });
    }

    return res.status(200).json({
      status: true,
      success: {
        message: "Successfully uploaded the file.",
      },
      fileName: File.filename,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: {
        message: "Cant save the file due to server error!",
      },
    });
  }
};

// ---------- Function to delete file from the storage ----------
const DeleteFile = async (req, res) => {
  const FilePath = path.join(
    __dirname,
    "../../../../uploads",
    req.params.fileName
  );

  fs.unlink(FilePath, (err) => {
    if (err) {
      return res.status(400).json({
        status: false,
        error: {
          message: "Failed to delete file.",
        },
      });
    }

    res.status(200).json({
      status: true,
      success: {
        message: "Successfully delete the file.",
      },
    });
  });
};

module.exports = {
  SaveFile,
  DeleteFile,
};
