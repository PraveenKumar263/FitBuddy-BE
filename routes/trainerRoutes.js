const express = require("express");
const trainerRouter = express.Router();
const trainerController = require("../controllers/trainerController");
const auth = require("../utils/auth");

// Get featured trainers
trainerRouter.get("/featured", trainerController.getFeaturedTrainers);

// Get all trainers
trainerRouter.get("/", auth.verifyToken, trainerController.getAllTrainers);

// Get trainer by userId
trainerRouter.get(
  "/:userId",
  auth.verifyToken,
  trainerController.getTrainerByUserId
);

// Update trainer information by trainerId
trainerRouter.put(
  "/:userId",
  auth.verifyToken,
  auth.isTrainer,
  trainerController.updateTrainer
);

module.exports = trainerRouter;
