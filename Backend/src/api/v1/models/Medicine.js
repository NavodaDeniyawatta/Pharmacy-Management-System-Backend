// -------------------- Thirdparty Libraries and Modules --------------------
const mongoose = require("mongoose");

// -------------------- Medicine Schema --------------------
const MedicineSchema = new mongoose.Schema(
  {
    medicineCode: {
      type: String,
      require: true,
    },
    medicineName: {
      type: String,
      require: true,
    },
    image: {
      type: String,
    },
    currentCount: {
      type: String,
    },
    minimumCount: {
      type: String,
    },
    buyPrice: {
      type: String,
      require: true,
    },
    salePrice: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Medicine", MedicineSchema);
