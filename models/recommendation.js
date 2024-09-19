// Imports
const mongoose = require("mongoose");

// Create a new schema
const recommendationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recommendedClasses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create a new model and export it
module.exports = mongoose.model(
  "Recommendation",
  recommendationSchema,
  "recommendations"
);
