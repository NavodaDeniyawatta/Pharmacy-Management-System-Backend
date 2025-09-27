// ---------- Function to Generate OTP ----------
const GenerateOTP = () => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  const expiry = new Date(Date.now() + 10 * 60 * 1000);

  return { otp, expiry };
};

module.exports = { GenerateOTP };
