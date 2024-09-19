// Imports
const mongoose = require("mongoose");

// Create a new schema
const paymentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["Credit Card", "Debit Card", "Digital Wallet"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    transactionId: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create a new model and export it
module.exports = mongoose.model("Payment", paymentSchema, "payments");
