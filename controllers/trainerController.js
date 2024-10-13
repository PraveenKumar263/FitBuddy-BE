const Trainer = require("../models/trainer");

const trainerController = {
  getAllTrainers: async (req, res) => {
    try {
      // Get trainers
      const trainers = await Trainer.find({});

      return res.json(trainers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getTrainerByUserId: async (req, res) => {
    try {
      const { userId } = req.params;

      // Check if trainer exists
      const trainer = await Trainer.findOne({ user: userId });

      if (!trainer || trainer.length === 0) {
        return res.status(400).json({ message: "Trainer not found" });
      }

      return res.json(trainer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateTrainer: async (req, res) => {
    try {
      const userId = req.userId;

      // Check if trainer exists
      const trainer = await Trainer.findOne({ user: userId });

      // Update trainer's details
      const updatedTrainer = await Trainer.findByIdAndUpdate(
        trainer._id,
        req.body,
        { new: true }
      );

      return res.json(updatedTrainer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getFeaturedTrainers: async (req, res) => {
    try {
      const trainers = await Trainer.find()
        .sort({ rating: -1 })
        .limit(3)
        .populate("user", "firstName lastName profilePicture");
      return res.json(trainers || []);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = trainerController;
