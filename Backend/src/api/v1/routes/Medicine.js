// ----------Third-party libraries & modules----------
const express = require("express");

// ----------Custom libraries & modules----------
const {
  CreateMedicine,
  GetMedicineById,
  GetAllMedicines,
  UpdateMedicine,
  SearchMedicine,
  DeleteMedicine,
} = require("../controllers");
const { AuthenticateUser, AuthorizeUser } = require("../middleware");

// ---------- Initialize the router ----------
const router = express.Router();

// ----- Create Medicine -----
router.post(
  "/create",
  AuthenticateUser,
  AuthorizeUser(["Admin"]),
  CreateMedicine
);

// ----- Get All Medicines -----
router.get(
  "/all",
  AuthenticateUser,
  AuthorizeUser(["Admin", "Customer", "Moderator"]),
  GetAllMedicines
);

// ----- Get Medicine By Id -----
router.get(
  "/one/:medicineId",
  AuthenticateUser,
  AuthorizeUser(["Admin", "Moderator"]),
  GetMedicineById
);

// ----- Update Medicine details -----
router.put(
  "/update/:medicineId",
  AuthenticateUser,
  AuthorizeUser(["Admin", "Moderator"]),
  UpdateMedicine
);

// ----- Search Medicine -----
router.get(
  "/search",
  AuthenticateUser,
  AuthorizeUser(["Admin", "Customer", "NewUser", "Moderator"]),
  SearchMedicine
);

// ----- Delete Medicine -----
router.delete(
  "/delete/:medicineId",
  AuthenticateUser,
  AuthorizeUser(["Admin", "Moderator"]),
  DeleteMedicine
);

module.exports = router;
