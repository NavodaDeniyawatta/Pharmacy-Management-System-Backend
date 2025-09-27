// -------------------- Third-party Libraries and Modules --------------------
const mongoose = require("mongoose");

// -------------------- Custom Libraries and Modules --------------------
const Config = require("../../../configs");

// -------------------- Function to initialize mongodb connection --------------------
const ConnectDatabase = async() => {
    return await mongoose.connect(Config.MONGO_DB_URL);
};

module.exports = { ConnectDatabase };