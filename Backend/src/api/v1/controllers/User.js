// ----------------------- Third-party libraries and modules -----------------------
const bcrypt = require("bcrypt");

// -------------------- Custom  libraries and modules -------------------
const { UserModel } = require("../models");
const { GenerateTokens } = require("../libraries");
const mongoose = require("mongoose");

// -------------------- Function to create user --------------------
const CreateUser = async (req, res) => {
  // Request Body
  const {
    name,
    image,
    email,
    telephone,
    birthday,
    address,
    userType,
    password,
  } = req.body;

  try {
    // Check email already exsit
    const User = await UserModel.findOne({ email: email }).exec();

    if (User) {
      return res.status(400).json({
        status: false,
        error: {
          message: "User email already exist!",
        },
      });
    }

    // Password encryptions
    const EncryptedPassword = await bcrypt.hash(password, 8);

    // New user
    const NewUser = new UserModel({
      name,
      image,
      email,
      telephone,
      birthday,
      address,
      userType,
      password: EncryptedPassword,
    });

    // Save new user to the database
    const SavedUser = await NewUser.save();

    return res.status(201).json({
      status: true,
      user: SavedUser,
      success: {
        message: "Successfully created a new user!",
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to create a new user due to server error!",
      },
    });
  }
};

// -----------------------Function to login user-----------------------
const LoginUser = async (req, res) => {
  // Request body
  const { email, password } = req.body;

  console.log("LoginUser Request:", req.body);

  try {
    // Check if email address already available
    const User = await UserModel.findOne({ email }).exec();
    if (!User) {
      return res.status(401).json({
        status: false,
        error: { message: "Wrong Email Address!" },
      });
    }

    // Check if password matches
    const PassMatch = bcrypt.compare(password, User.password);
    if (!PassMatch) {
      return res.status(401).json({
        status: false,
        error: { message: "Wrong password!" },
      });
    }

    // Generate tokens
    const { accessToken } = GenerateTokens(User);

    return res.status(200).json({
      status: true,
      accessToken,
      id: User._id,
      name: User.name,
      userType: User.userType,
      image: User.image,
      success: { message: "Successfully logged in the user!" },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: { message: "Failed to login the user due to server error!" },
    });
  }
};

// -----------------------Function to get all users-----------------------
const GetAllUsers = async (req, res) => {
  try {
    const users = await UserModel.aggregate([
      {
        $project: {
          password: 0, // Exclude password field from the results
        },
      },
    ]).exec();

    return res.status(200).json({
      status: true,
      users: users,
      success: { message: "Successfully fetched all users!" },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: { message: "Failed to fetch all users due to server error!" },
    });
  }
};

// -----------------------Function to get user by id-----------------------
const GetUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    // Check user already available
    const User = await UserModel.findOne({ _id: userId }).exec();
    if (!User) {
      return res.status(404).json({
        status: false,
        success: { message: "No user available for the provided user id!" },
      });
    }

    return res.status(200).json({
      status: true,
      user: User,
      success: { message: "Successfully fetched the user!" },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      success: { message: "Failed to fetch the user due to server error!" },
    });
  }
};

// --------------------- Function to get all users except the given user id --------------------
const GetAllUsersExceptUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    // check user exists for provided user id
    const user = await UserModel.findOne({ _id: userId }).exec();
    if (!user) {
      return res.status(404).json({
        status: false,
        error: { message: "User not found!" },
      });
    }
    // Fetch all users except the given user id
    const users = await UserModel.aggregate([
      {
        $match: { _id: { $ne: new mongoose.Types.ObjectId(userId) } }, // Exclude the user with the given userId
      },
      {
        $project: {
          password: 0, // Exclude password field from the results
        },
      },
    ]).exec();

    console.log("Users: ", users);

    return res.status(200).json({
      status: true,
      users: users,
      success: {
        message: "Successfully fetched all users except the given user!",
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      success: { message: "Failed to fetch the users due to server error!" },
    });
  }
};

// -------------------- Function to update user --------------------
const UpdateUser = async (req, res) => {
  // Request parameters
  const { userId } = req.params;

  try {
    const user = await UserModel.findOne({
      _id: userId,
    }).exec();
    if (!user) {
      return res.status(404).json({
        status: true,
        error: { message: "User not found!" },
      });
    }
    const updateuser = await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      status: true,
      updateuser,
      success: {
        message: "Successfully updated the user information!",
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to update the basic user information!",
      },
    });
  }
};

// -------------------- Function to update password --------------------
const UpdateUserPassword = async (req, res) => {
  // Request parameters
  const { userId } = req.params;

  // Request body
  const { currentPassword, newPassword } = req.body;

  console.log("UpdateUserPassword Request:", req.body, userId);

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      status: false,
      error: { message: "Both current and new passwords are required!" },
    });
  }

  // Check if user available according to the id
  const user = await UserModel.findById(userId).exec();
  if (!user) {
    return res.status(404).json({
      status: false,
      error: { message: "User doesn't exists!" },
    });
  }

  // Check if password matches
  const passMatch = await bcrypt.compare(currentPassword, user.password);
  if (!passMatch) {
    return res.status(401).json({
      status: false,
      error: { message: "Wrong current password!" },
    });
  }

  try {
    user.password = await bcrypt.hash(newPassword, 8);
    await user.save();

    console.log("password updated successfully");
    return res.status(200).json({
      status: true,
      success: { message: "Password successfully updated!" },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: { message: "Failed to update the password!" },
    });
  }
};

// --------------------- Function to delete user --------------------
const DeleteUser = async (req, res) => {
  // Request parameters
  const { userId } = req.params;

  try {
    // Find the user by id
    const user = await UserModel.findOne({ _id: userId }).exec();

    // If the user does not exist, return a 404 response
    if (!user) {
      return res.status(404).json({
        status: false,
        error: {
          message: "User not found!",
        },
      });
    }

    // Remove the user
    await UserModel.findOneAndDelete({ _id: userId });

    return res.status(200).json({
      status: true,
      success: {
        message: "Successfully deleted the user!",
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: {
        message: "Failed to delete the user!",
      },
    });
  }
};

module.exports = {
  CreateUser,
  LoginUser,
  GetAllUsers,
  GetUserById,
  GetAllUsersExceptUserId,
  UpdateUser,
  UpdateUserPassword,
  DeleteUser,
};
