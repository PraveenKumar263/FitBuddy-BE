const express = require("express");
const availabilityController = require("../controllers/availabilityController");
const availabilityRouter = express.Router();
const auth = require("../utils/auth");

// Create new availability (including date and selected slots)
availabilityRouter.post(
  "/",
  auth.verifyToken,
  availabilityController.createAvailability
);

// Get availability by trainerId
availabilityRouter.get(
  "/trainer/:trainerId",
  auth.verifyToken,
  availabilityController.getAvailabilityByTrainer
);

// Delete availability slot by id
availabilityRouter.delete(
  "/slot/:slotId",
  auth.verifyToken,
  availabilityController.deleteAvailability
);

module.exports = availabilityRouter;
