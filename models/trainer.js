// Imports
const mongoose = require("mongoose");

// Create a new schema
const trainerSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    qualifications: [String],
    expertise: [String],
    specializations: [String],
    profilePicture: String,
    introduction: String,
    photos: [String],
    videos: [String],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create a new model and export it
module.exports = mongoose.model("Trainer", trainerSchema, "trainers");
