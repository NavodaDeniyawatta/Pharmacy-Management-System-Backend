// -------------------- Imports --------------------
const { ConnectDatabase } = require("./ConnectDatabase");
const { GenerateTokens, VerifyTokens } = require("./ManageTokens");
const { FileUpload } = require("./StoreFiles");
const { CreatePayment } = require("./Payment");
const { SendEmail } = require("./SendEmail");
const { GenerateOTP } = require("./GenerateOTP");

// -------------------- Exports --------------------
module.exports = {
  ConnectDatabase,
  GenerateTokens,
  VerifyTokens,
  CreatePayment,
  FileUpload,
  SendEmail,
  GenerateOTP,
};
