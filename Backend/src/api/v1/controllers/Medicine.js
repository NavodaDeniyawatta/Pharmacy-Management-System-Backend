// -------------------- Custom  libraries and modules -------------------
const { MedicineModel } = require("../models");

// -------------------- Function to Create Medicine --------------------
const CreateMedicine = async (req, res) => {
  // Request Body
  const {
    medicineCode,
    medicineName,
    image,
    currentCount,
    minimumCount,
    buyPrice,
    salePrice,
    status,
  } = req.body;

  try {
    const Medicine = await MedicineModel.findOne({
      medicineCode: medicineCode,
    }).exec();
    if (Medicine) {
      return res.status(400).json({
        status: false,
        error: {
          message: "Medicine Code already exist!",
        },
      });
    }

    const NewMedicine = new MedicineModel({
      medicineCode,
      medicineName,
      image,
      currentCount,
      minimumCount,
      buyPrice,
      salePrice,
      status,
    });

    const SaveNewMedicine = await NewMedicine.save();
    return res.status(201).json({
      status: true,
      medicine: SaveNewMedicine,
      success: {
        message: "Successfully saved a new medicine!",
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to save a new medicine due to server error!",
      },
    });
  }
};

// -------------------- Function to Get Medicie by Id --------------------
const GetMedicineById = async (req, res) => {
  const { medicineId } = req.params;
  try {
    const Medicine = await MedicineModel.findOne({ _id: medicineId }).exec();
    if (!Medicine)
      return res.status(404).json({
        status: false,
        error: {
          message: "Medicine not found!",
        },
      });

    return res.status(200).json({
      status: true,
      medicine: Medicine,
      success: {
        message: "Successfully fetched medicine details!",
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to fetch medicine details due to server error!",
      },
    });
  }
};

// -------------------- Function to Get All Medicines --------------------
const GetAllMedicines = async (req, res) => {
  try {
    const Medicines = await MedicineModel.find();
    return res.status(200).json({
      status: true,
      medicines: Medicines,
      success: {
        message: "Successfully fetched medicines details!",
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to fetch medicines details due to server error!",
      },
    });
  }
};

// -------------------- Function to Update Medicines --------------------
const UpdateMedicine = async (req, res) => {
  const { medicineId } = req.params;
  try {
    const UpdatedMedicine = await MedicineModel.findByIdAndUpdate(
      medicineId,
      req.body,
      { new: true }
    );
    if (!UpdatedMedicine) {
      return res.status(404).json({
        status: false,
        error: {
          message: "Medicine not found!",
        },
      });
    }
    return res.status(200).json({
      status: true,
      medicine: UpdatedMedicine,
      success: {
        message: "Successfully updated medicine details!",
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to update medicines details due to server error!",
      },
    });
  }
};

// -------------------- Function to Search Medicine ---------------------
const SearchMedicine = async (req, res) => {
  try {
    const { name } = req.query;
    const Medicines = await MedicineModel.find({
      medicineName: new RegExp(name, "i"),
    });
    return res.status(200).json({
      status: true,
      medicines: Medicines,
      success: {
        message: "Successfully fetched medicines!",
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to fetch medicines due to server error!",
      },
    });
  }
};

// -------------------- Function to Delete Medicine ---------------------
const DeleteMedicine = async (req, res) => {
  const { medicineId } = req.params;
  console.log("Deleting medicine with ID:", medicineId);
  try {
    const DeletedMedicine = await MedicineModel.findByIdAndDelete(medicineId);
    if (!DeletedMedicine)
      return res.status(404).json({
        status: false,
        error: {
          message: "Medicine not found!",
        },
      });
    return res.status(200).json({
      status: true,
      success: {
        message: "Successfully deleted medicine!",
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to delete medicine due to server error!",
      },
    });
  }
};

module.exports = {
  CreateMedicine,
  GetMedicineById,
  GetAllMedicines,
  UpdateMedicine,
  SearchMedicine,
  DeleteMedicine,
};
