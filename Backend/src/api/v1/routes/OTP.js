// ----------Third-party libraries & modules----------
const express = require("express");

// ----------Custom libraries & modules----------
const { GenerateNewOTP, ValidateOTP } = require("../controllers");

// ---------- Initialize the router ----------
const router = express.Router();

// ----- Create OTP -----
router.post("/create", GenerateNewOTP);

// ----- Validate OTP -----
router.post("/validate", ValidateOTP);

module.exports = router;
