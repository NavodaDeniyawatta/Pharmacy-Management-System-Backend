// -------------------- Thirdparty Libraries and Modules --------------------
const mongoose = require("mongoose");

// -------------------- Order Schema --------------------
const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      require: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    pdf: {
      type: String,
      require: true,
    },
    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        count: {
          type: String,
          required: true,
        },
        price: {
          type: String,
          required: true,
        },
      },
    ],
    total: {
      type: String,
      require: true,
    },
    paymentStatus: {
      type: String,
      require: true,
    },
    deliveryStatus: {
      type: String,
      require: true,
    },
    dateCreated: {
      type: String,
      require: true,
    },
    timeCreated: {
      type: String,
      require: true,
    },
    dateUpdated: {
      type: String,
    },
    timeUpdated: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
