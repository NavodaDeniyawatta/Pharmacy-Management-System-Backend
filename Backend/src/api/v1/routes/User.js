// ----------Third-party libraries & modules----------
const express = require("express");

// ----------Custom libraries & modules----------
const {
  CreateUser,
  LoginUser,
  GetAllUsers,
  GetUserById,
  GetAllUsersExceptUserId,
  UpdateUser,
  UpdateUserPassword,
  DeleteUser,
} = require("../controllers");

const { AuthenticateUser, AuthorizeUser } = require("../middleware");

// ---------- Initialize the router ----------
const router = express.Router();

// ----- Create User -----
router.post("/register", CreateUser);

// ----- Login User -----
router.post("/login", LoginUser);

// ----- Get All Users -----
router.get("/all", AuthenticateUser, AuthorizeUser(["Admin"]), GetAllUsers);

// ----- Get All Users -----
router.get(
  "/all/:userId",
  AuthenticateUser,
  AuthorizeUser(["Admin"]),
  GetAllUsersExceptUserId
);

// ----- Get User By Id -----
router.get(
  "/one/:userId",
  AuthenticateUser,
  AuthorizeUser(["Admin", "Customer", "Moderator", "NewUser"]),
  GetUserById
);

// ----- Update User details -----
router.put(
  "/update/:userId",
  AuthenticateUser,
  AuthorizeUser(["Admin", "Customer", "Moderator", "NewUser"]),
  UpdateUser
);

// ----- Update User password -----
router.put(
  "/update/auth/:userId",
  AuthenticateUser,
  AuthorizeUser(["Admin", "Customer", "Moderator", "NewUser"]),
  UpdateUserPassword
);

// ----- Delete User -----
router.delete(
  "/delete/:userId",
  AuthenticateUser,
  AuthorizeUser(["Admin", "Moderator"]),
  DeleteUser
);

module.exports = router;
