const { STRIPE_SECRET_KEY } = require("../utils/config");
const User = require("../models/user");
const stripe = require("stripe")(STRIPE_SECRET_KEY);

const paymentController = {
  createSubscription: async (req, res) => {
    const { userId, plan } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
        });
        customerId = customer.id;

        user.stripeCustomerId = customerId;
        await user.save();
      }

      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: plan }],
      });

      user.membership = {
        plan,
        expirationDate: new Date(
          Date.now() + (plan === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000
        ),
      };
      await user.save();

      return res.status(200).json({ subscription });
    } catch (error) {
      console.error("Error creating subscription:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while creating subscription." });
    }
  },
  webhook: async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_SECRET_KEY);
    } catch (err) {
      console.error("Webhook error:", err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case "invoice.payment_succeeded":
        const successfulPayment = event.data.object;
        console.log(
          `Payment succeeded for subscription: ${successfulPayment.id}`
        );
        break;
      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object;
        console.log(`Subscription deleted: ${deletedSubscription.id}`);
        break;
      default:
        return res.status(400).end();
    }

    res.status(200).end();
  },
};

module.exports = paymentController;
