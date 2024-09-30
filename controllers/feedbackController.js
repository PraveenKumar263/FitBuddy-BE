const Feedback = require("../models/feedback");
const Trainer = require("../models/trainer");

const feedbackController = {
  createFeedback: async (req, res) => {
    try {
      const { trainerId, userId, rating, comment, classId, bookingId } =
        req.body;

      // Check if trainer exists
      const trainer = await Trainer.findById(trainerId);
      if (!trainer) {
        return res.status(400).json({ message: "Trainer not found" });
      }

      // Create feedback
      const newFeedback = new Feedback({
        booking: bookingId,
        trainer: trainerId,
        user: userId,
        class: classId,
        rating,
        comment,
      });

      const savedFeedback = await newFeedback.save();

      // Update trainer's average rating
      const feedbacks = await Feedback.find({ trainer: trainerId });
      const averageRating =
        feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) /
        feedbacks.length;
      await Trainer.findByIdAndUpdate(trainerId, { rating: averageRating });

      return res.status(201).json(savedFeedback);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getFeedbackByTrainer: async (req, res) => {
    try {
      const { trainerId } = req.params;

      // Get feedback
      const feedbacks = await Feedback.find({ trainer: trainerId });
      if (!feedbacks) {
        return res.status(400).json({ message: "No feedback found" });
      }

      return res.json(feedbacks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getFeedbackByBookingId: async (req, res) => {
    try {
      const { bookingId } = req.params;

      // Get feedback
      const feedbacks = await Feedback.find({ booking: bookingId });
      if (!feedbacks) {
        return res.status(400).json({ message: "No feedback found" });
      }

      return res.json(feedbacks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteFeedback: async (req, res) => {
    try {
      const { feedbackId } = req.params;

      // Delete feedback
      const deletedFeedback = await Feedback.findByIdAndDelete(feedbackId);
      if (!deletedFeedback) {
        return res.status(400).json({ message: "Feedback not found" });
      }

      return res.json({ message: "Feedback deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getFeaturedFeedback: async (req, res) => {
    try {
      const { classId } = req.params;
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getFeaturedFeedback: async (req, res) => {
    try {
      const { classId } = req.params;

      // Get  top 3 feedback for a class
      const topFeedbacks = await Feedback.find({ class: classId })
        .sort({ rating: -1 })
        .limit(3)
        .populate("user", "firstName");

      if (!topFeedbacks.length) {
        return res
          .status(400)
          .json({ message: "No feedback found for this class" });
      }

      return res.json(topFeedbacks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = feedbackController;
