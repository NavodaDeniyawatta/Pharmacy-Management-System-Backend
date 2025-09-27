// ----------Third-party libraries & modules----------
const express = require("express");

// ----------Custom libraries & modules----------
const {
  CreateOrderWithPayment,
  GetAllOrders,
  GetAllOrdersByUserId,
  UpdateOrder,
  DeleteOrder,
} = require("../controllers");
const { AuthenticateUser, AuthorizeUser } = require("../middleware");

// ---------- Initialize the router ----------
const router = express.Router();

// ----- Create Payment -----
router.post(
  "/create",
  AuthenticateUser,
  AuthorizeUser(["Admin", "Moderator", "Customer"]),
  CreateOrderWithPayment
);

// ----- Get All Orders -----
router.get(
  "/all",
  AuthenticateUser,
  AuthorizeUser(["Admin", "Moderator"]),
  GetAllOrders
);

// ----- Get ALl Orders by userId -----
router.get(
  "/all/:userId",
  AuthenticateUser,
  AuthorizeUser(["Admin", "Moderator", "Customer"]),
  GetAllOrdersByUserId
);

// ----- Update Order -----
router.put(
  "/update",
  AuthenticateUser,
  AuthorizeUser(["Admin", "Moderator"]),
  UpdateOrder
);

// ----- Delete Order -----
router.delete(
  "/delete/:orderId",
  AuthenticateUser,
  AuthorizeUser(["Admin", "Moderator"]),
  DeleteOrder
);

module.exports = router;
