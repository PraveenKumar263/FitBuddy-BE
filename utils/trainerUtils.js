const Trainer = require("../models/trainer");

const updateTrainerById = async (userId, updates) => {
  try {
    const { userId } = req.params;

    // Check if trainer exists
    const trainer = await Trainer.findOne({ user: userId });
    if (!trainer) {
      throw Error("Trainer not found");
    }
    // Update trainer's details
    const updatedTrainer = await Trainer.findByIdAndUpdate(
      trainer._id,
      updates,
      { new: true }
    );

    return res.json(updatedTrainer);
  } catch (error) {
    throw Error({ message: error.message });
  }
};
