// -------------------- Third party library and modules --------------------
const Stripe = require("stripe");

// -------------------- Custom Library and modules --------------------
const Congigs = require("../../../configs");

const stripe = Stripe(Congigs.STRIPE_SECRET_KEY);

const CreatePayment = async (amount, paymentMethodId) => {
  console.log(
    "Creating payment with amount:",
    amount,
    "and payment method ID:",
    paymentMethodId
  );
  try {
    // create payment
    const payment = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method: paymentMethodId,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });
    console.log("Payment created successfully:", payment);
    return {
      status: true,
      paymentId: payment.id,
      clientSecret: payment.client_secret,
    };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

module.exports = { CreatePayment };
