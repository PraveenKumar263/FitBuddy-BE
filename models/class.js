// Imports
const mongoose = require("mongoose");

// Create a new schema
const classSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String, required: true },
    type: {
      type: String,
      enum: ["yoga", "strength training", "cardio", "other"],
      required: true,
    },
    duration: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    capacity: { type: Number, required: true },
    slotsAvailable: { type: Number, required: true },
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
    rating: { type: Number, min: 0, max: 5 },
    // tags: [String],
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Class", classSchema, "classes");
