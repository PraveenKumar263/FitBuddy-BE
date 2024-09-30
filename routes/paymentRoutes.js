const express = require("express");
const paymentController = require("../controllers/paymentController");
const paymentRouter = express.Router();

// Create a new checkout session
paymentRouter.post("/checkout", paymentController.createSubscription);

// Handle Stripe webhook events
paymentRouter.post("/webhook", paymentController.webhook);

module.exports = paymentRouter;
