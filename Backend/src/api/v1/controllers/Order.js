// -------------------- Thirdpary libraries and modules --------------------
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

// -------------------- Custom libraryies and modules --------------------
const { OrderModel, MedicineModel } = require("../models");
const { CreatePayment } = require("../libraries");
const Configs = require("../../../configs");

const stripe = require("stripe")(Configs.STRIPE_SECRET_KEY);

// ---------- Function to create order with payment ----------
const CreateOrderWithPayment = async (req, res) => {
  try {
    const { userId, paymentMethodId, items, total, pdf, deliveryStatus } =
      req.body;

    if (!paymentMethodId || !total || !pdf || !userId || !items) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const paymentResponse = await CreatePayment(
      Number(total) * 100,
      paymentMethodId
    );

    if (!paymentResponse.status) {
      return res.status(500).json({ message: paymentResponse.error });
    }

    const confirmedPayment = await stripe.paymentIntents.confirm(
      paymentResponse.paymentId
    );

    if (confirmedPayment.status !== "succeeded") {
      return res.status(402).json({ message: "Payment failed" });
    }

    // Save order in MongoDB
    const order = new OrderModel({
      orderId: uuidv4(),
      userId,
      pdf,
      items,
      paymentStatus: "Success",
      deliveryStatus,
      total,
      dateCreated: new Date().toISOString().split("T")[0],
      timeCreated: new Date().toTimeString().split(" ")[0],
      dateUpdated: new Date().toISOString().split("T")[0],
      timeUpdated: new Date().toTimeString().split(" ")[0],
    });

    await order.save();

    return res.status(201).json({
      status: true,
      success: { message: "Order Created Successfully" },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: { message: "Failed to create order due to server error!" },
    });
  }
};

// ---------- Function to get all orders ----------
const GetAllOrders = async (req, res) => {
  try {
    const allOrders = await OrderModel.aggregate([
      { $sort: { createdAt: -1 } },
    ]);

    if (allOrders.length == 0) {
      return res.status(404).json({
        status: false,
        error: { message: "Orders not found!" },
      });
    } else {
      return res.status(200).json({
        status: true,
        orders: allOrders,
        success: { message: "Successfully get all orders!" },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: { message: "Failed to get all orders due to server error!" },
    });
  }
};

// ---------- Function to get all orders by userId ----------
const GetAllOrdersByUserId = async (req, res) => {
  try {
    // Get user Id
    const { userId } = req.params;

    const allOrders = await OrderModel.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
      },
      { $sort: { createdAt: -1 } },
    ]);

    if (allOrders.length == 0) {
      return res.status(404).json({
        status: false,
        error: { message: "Orders not found!" },
      });
    } else {
      return res.status(200).json({
        status: true,
        orders: allOrders,
        success: { message: "Successfully get all orders!" },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: { message: "Failed to get all orders due to server error!" },
    });
  }
};

// ---------- Function to update order ----------
const UpdateOrder = async (req, res) => {
  try {
    const { id, ...updateFields } = req.body;

    const order = await OrderModel.findOne({ _id: id }).exec();

    if (!order) {
      return res.status(404).json({
        status: false,
        error: { message: "Order not found!" },
      });
    }

    const previousStatus = order.deliveryStatus;
    const newStatus = updateFields.deliveryStatus;

    // Prevent delivering before confirming
    if (newStatus === "Delivered" && previousStatus !== "Confirmed") {
      return res.status(400).json({
        status: false,
        error: {
          message: "You must confirm the order before marking it as delivered.",
        },
      });
    }

    // Step 1: Check stock availability first before reducing anything
    if (newStatus === "Confirmed") {
      for (const item of order.items) {
        const medicine = await MedicineModel.findById(item.itemId).exec();
        if (!medicine) continue;

        const currentCount = parseInt(medicine.currentCount || "0", 10);
        const orderCount = parseInt(item.count || "0", 10);

        if (currentCount < orderCount) {
          return res.status(400).json({
            status: false,
            error: {
              message: `Not enough stock for ${medicine.medicineName}`,
            },
          });
        }
      }

      // Step 2: All items have enough stock → proceed to reduce
      for (const item of order.items) {
        const medicine = await MedicineModel.findById(item.itemId).exec();
        if (!medicine) continue;

        const currentCount = parseInt(medicine.currentCount || "0", 10);
        const orderCount = parseInt(item.count || "0", 10);
        const minimumCount = parseInt(medicine.minimumCount || "0", 10);

        const newCount = currentCount - orderCount;
        medicine.currentCount = newCount.toString();

        // Update status
        if (newCount === 0) {
          medicine.status = "Out of Stock";
        } else if (newCount <= minimumCount) {
          medicine.status = "Low Stock";
        } else {
          medicine.status = "Available";
        }

        await medicine.save();
      }
    }

    // Restore stock if order is being cancelled
    if (
      newStatus === "Cancelled" &&
      (previousStatus === "Confirmed" || previousStatus === "Delivered")
    ) {
      for (const item of order.items) {
        const medicine = await MedicineModel.findById(item.itemId).exec();
        if (!medicine) continue;

        const currentCount = parseInt(medicine.currentCount || "0", 10);
        const orderCount = parseInt(item.count || "0", 10);
        const minimumCount = parseInt(medicine.minimumCount || "0", 10);

        const newCount = currentCount + orderCount;
        medicine.currentCount = newCount.toString();

        if (newCount === 0) {
          medicine.status = "Out of Stock";
        } else if (newCount <= minimumCount) {
          medicine.status = "Low Stock";
        } else {
          medicine.status = "Available";
        }

        await medicine.save();
      }
    }

    // Update fields in order
    Object.keys(updateFields).forEach((key) => {
      order[key] = updateFields[key];
    });

    await order.save();

    res.status(200).json({
      status: true,
      message: "Order updated successfully!",
      data: order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: false,
      error: { message: "Internal Server Error" },
    });
  }
};

// ---------- Function to delete order ----------
const DeleteOrder = async (req, res) => {
  try {
    // Get order Id
    const { orderId } = req.params;

    const order = await OrderModel.findOne({ _id: orderId }).exec();

    if (!order) {
      return res.status(404).json({
        status: false,
        error: { message: "Order not found!" },
      });
    }

    await OrderModel.deleteOne({ _id: orderId });

    return res.status(200).json({
      status: true,
      success: { message: "Order deleted successfully!" },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: { message: "Failed to delete order due to server error!" },
    });
  }
};

module.exports = {
  CreateOrderWithPayment,
  GetAllOrders,
  GetAllOrdersByUserId,
  UpdateOrder,
  DeleteOrder,
};
