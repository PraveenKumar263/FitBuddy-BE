const express = require("express");
const feedbackController = require("../controllers/feedbackController");
const feedbackRouter = express.Router();
const auth = require("../utils/auth");

// Create a new feedback
feedbackRouter.post("/", auth.verifyToken, feedbackController.createFeedback);

// Get all feedback by trainerId
feedbackRouter.get(
  "/feedback-trainer/:trainerId",
  auth.verifyToken,
  feedbackController.getFeedbackByTrainer
);

// Get feedback by bookingId
feedbackRouter.get(
  "/feedback-booking/:bookingId",
  auth.verifyToken,
  feedbackController.getFeedbackByBookingId
);

// Delete a feedback by feedbackId
feedbackRouter.delete(
  "/:feedbackId",
  auth.verifyToken,
  feedbackController.deleteFeedback
);

module.exports = feedbackRouter;
