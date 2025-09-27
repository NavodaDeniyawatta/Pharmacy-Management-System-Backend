// -------------------- Third party libraries and modules --------------------
const express = require("express");

// -------------------- Custom libraries and modules --------------------
const { SaveFile, DeleteFile } = require("../controllers");
const { FileUpload } = require("../libraries");

// -------------------- Initialize the router --------------------
const router = express.Router();

// -------------------- Routes --------------------
// Save File
router.post("/save", FileUpload("file"), SaveFile);

// Delete File
router.delete("/delete/:fileName", DeleteFile);

module.exports = router;
