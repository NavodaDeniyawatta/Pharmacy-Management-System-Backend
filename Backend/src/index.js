// -------------------- Thirdparty libraries and modules --------------------
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv/config");

// -------------------- Custom Libraries and Modules --------------------
const Configuration = require("./configs");
const { ConnectDatabase } = require("./api/v1/libraries");
const {
  UserRoutes,
  MedicineRoutes,
  FileRoutes,
  OrderRoutes,
  OTPRoutes,
} = require("./api/v1/routes");

// -------------------- Global Instanse --------------------
const app = express();
const PORT = Configuration.PORT || 3308;

// -------------------- Comon middlewares --------------------
app.use(cors());

// -------------------- Accept json --------------------
app.use(express.json());

// ---------- Base Route ----------
app.get("/servertest", (req, res) => {
  res.status(200).json({
    status: true,
    success: {
      message: "Welcome to the server!",
    },
  });
});

app.use(express.static("static"));

// Allow access uploads folder
app.use("/uploads", express.static("./uploads/"));

// ---------- User Route ----------
app.use("/api/users", UserRoutes);

// ---------- Medicine Route ----------
app.use("/api/medicines", MedicineRoutes);

// ---------- File Route ----------
app.use("/api/files", FileRoutes);

// ---------- Order Route ----------
app.use("/api/order", OrderRoutes);

// ---------- OTP Route ----------
app.use("/api/otp", OTPRoutes);

// ---------- Frontend Route ----------
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "static/index.html"));
});

// -------------------- Error Route --------------------
app.use((req, res) => {
  res.status(404).json({
    error: { message: `Not found!` },
  });
});

// -------------------- Initialize Connections --------------------
app.listen(PORT, () => {
  console.log(`Server is Running at ${PORT} port`);
  ConnectDatabase()
    .then(() => console.log("Connected to Database!"))
    .catch((err) => console.error(err));
});
