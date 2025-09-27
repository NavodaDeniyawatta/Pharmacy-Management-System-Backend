// -------------------- Custom Configuration --------------------
const Configuration = {
  ENVIRONMENT: process.env.ENVIRONMENT,
  PORT: process.env.PORT,
  MONGO_DB_URL: process.env.MONGO_DB_URL,
  JWT_ACCESS_KEY: process.env.JWT_ACCESS_KEY,
  JWT_REFRESH_KEY: process.env.JWT_REFRESH_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PUBISHED_KEY: process.env.STRIPE_PUBISHED_KEY,
  BREVO_API_KEY: process.env.BREVO_API_KEY,
};

module.exports = Configuration;
