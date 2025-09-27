// ---------- Custom libraries and modules ----------
const { UserModel, OTPModel } = require("../models");
const { GenerateOTP, SendEmail } = require("../libraries");

// ---------- Function to generate OTP code ----------
const GenerateNewOTP = async (req, res) => {
  try {
    // Request body
    const { email } = req.body;

    const user = await UserModel.findOne({ email: email }).exec();

    if (!user) {
      return res.status(404).json({
        status: false,
        error: { message: "User Not Found!" },
      });
    }

    const otpExists = await OTPModel.findOne({ email: email }).exec();

    if (otpExists) {
      // Get current and expiry date
      const now = new Date();
      const expiryDate = new Date(otpExists.expiry);

      // Check the time difference
      if (now < expiryDate) {
        return res.status(400).json({
          status: false,
          error: { message: "OTP code already generated and sent!" },
        });
      } else {
        // OTP expired, delete and generate new one
        await OTPModel.deleteOne({ _id: otpExists._id });
      }
    }

    const { otp, expiry } = GenerateOTP();

    const newOTP = new OTPModel({
      email: email,
      otp: otp,
      expiry: expiry,
    });

    // Save otp
    await newOTP.save();

    const emailResponse = await SendEmail({
      recipients: [{ email: email }],
      subject: "Your OTP Code for Account Verification",
      htmlContent: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #2c3e50;">Verification Code</h2>
            <p>Hello,</p>
            <p>Your One-Time Password (OTP) for verifying your account is:</p>
            <p style="font-size: 24px; font-weight: bold; color: #3498db;">${otp}</p>
            <p>This code will expire in 10 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
            <br/>
            <p>Best regards,<br/>PharmLanka Team</p>
          </div>
        `,
    });

    if (!emailResponse.status) {
      return res.status(500).json({
        status: false,
        error: { message: "OTP sending failed!" },
      });
    }

    return res.status(201).json({
      status: true,
      success: { message: "Successfully generated and sent the OTP!" },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      error: { message: "Failed to generate OTP code!" },
    });
  }
};

// ---------- Function to validate OTP ----------
const ValidateOTP = async (req, res) => {
  try {
    // Request body
    const { email, otp } = req.body;
    // Check otp code already exits
    const otpExists = await OTPModel.findOne({ email: email }).exec();

    if (!otpExists) {
      return res.status(404).json({
        status: false,
        error: { message: "OTP not found for this email!" },
      });
    }
    // Get current and expiry date
    const now = new Date();
    const expiryTime = new Date(otpExists.expiry);

    // Check the time difference
    if (now > expiryTime) {
      await OTPModel.deleteOne({ _id: otpExists._id });
      return res.status(400).json({
        status: false,
        error: { message: "OTP has expired!" },
      });
    }

    // Check the otp
    if (otpExists.otp != otp) {
      return res.status(400).json({
        status: false,
        error: { message: "Invalid OTP code!" },
      });
    }

    // If otp is valid and not expired then delete it
    await OTPModel.deleteOne({ _id: otpExists._id });

    return res.status(200).json({
      status: true,
      success: { message: "OTP is valid!" },
    });
  } catch (error) {
    console.error("Service Error:", error);
    return res.status(500).json({
      status: false,
      error: { message: "Failed to validate the OTP!" },
    });
  }
};

module.exports = { GenerateNewOTP, ValidateOTP };
