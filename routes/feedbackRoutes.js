const express = require("express");
const feedbackController = require("../controllers/feedbackController");
const feedbackRouter = express.Router();
const auth = require("../utils/auth");

// Create a new feedback
feedbackRouter.post("/", auth.verifyToken, feedbackController.createFeedback);

// Get all feedback by trainerId
feedbackRouter.get(
  "/:trainerId",
  auth.verifyToken,
  feedbackController.getFeedbackByTrainer
);

// Delete a feedback by feedbackId
feedbackRouter.delete(
  "/:feedbackId",
  auth.verifyToken,
  feedbackController.deleteFeedback
);

module.exports = feedbackRouter;
