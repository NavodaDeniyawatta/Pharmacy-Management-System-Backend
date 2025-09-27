// ---------- Third-party libraries and modules ----------
const axios = require("axios");

// ---------- Custom libraries and modules ----------
const Configs = require("../../../configs");

// ---------- Function for the  send email ----------
const SendEmail = async ({ recipients, subject, htmlContent }) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "PharamLanka",
          email: "pharmlanka2000@gmail.com",
        },
        to: recipients.map((recipient) => ({
          email: recipient.email,
        })),
        subject: subject,
        htmlContent:
          "<html><head></head><body><p>" + htmlContent + "</p></body></html>",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": `${Configs.BREVO_API_KEY}`,
        },
      }
    );

    if (response.status != 201) {
      return {
        status: false,
        error: { message: "Email sending failed!" },
      };
    }

    return {
      status: true,
      success: { message: "Email sent successfully!" },
    };
  } catch (error) {
    console.log(error);
    return {
      status: false,
      error: { message: "Failed to send the email!" },
    };
  }
};

module.exports = { SendEmail };
