// -------------------- Imports --------------------
const {
  CreateUser,
  LoginUser,
  GetAllUsers,
  GetUserById,
  GetAllUsersExceptUserId,
  UpdateUser,
  UpdateUserPassword,
  DeleteUser,
} = require("./User");

const {
  CreateMedicine,
  GetMedicineById,
  GetAllMedicines,
  UpdateMedicine,
  SearchMedicine,
  DeleteMedicine,
} = require("./Medicine");

const { SaveFile, DeleteFile } = require("./Files");

const {
  CreateOrderWithPayment,
  GetAllOrders,
  GetAllOrdersByUserId,
  UpdateOrder,
  DeleteOrder,
} = require("./Order");

const { GenerateNewOTP, ValidateOTP } = require("./OTP");

// -------------------- Exports --------------------
module.exports = {
  CreateUser,
  LoginUser,
  GetAllUsers,
  GetUserById,
  GetAllUsersExceptUserId,
  UpdateUser,
  UpdateUserPassword,
  DeleteUser,
  CreateMedicine,
  GetMedicineById,
  GetAllMedicines,
  UpdateMedicine,
  SearchMedicine,
  DeleteMedicine,
  SaveFile,
  DeleteFile,
  CreateOrderWithPayment,
  GetAllOrders,
  GetAllOrdersByUserId,
  UpdateOrder,
  DeleteOrder,
  GenerateNewOTP,
  ValidateOTP,
};
