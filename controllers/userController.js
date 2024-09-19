const User = require("../models/user");
const Trainer = require("../models/trainer");

const userController = {
  getUserDetails: async (req, res) => {
    try {
      const userId = req.userId;

      // Get the user details from the database
      const user = await User.findById(userId).select(
        "-password -activationToken -activationTokenExpiry -resetToken -resetTokenExpiry -createdAt -updatedAt"
      );
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      return res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateUserDetails: async (req, res) => {
    try {
      const userId = req.userId;
      const updates = req.body;

      // Update user details found
      const updatedUser = await User.findByIdAndUpdate(userId, updates, {
        new: true,
      });
      if (!updatedUser) {
        return res.status(400).json({ message: "User not found" });
      }

      // Update the trainer details, if needed
      if (updatedUser.role === "trainer") {
        const trainerUpdates = {
          qualifications: updates.qualifications,
          expertise: updates.expertise,
          specializations: updates.specializations,
          availableTimes: updates.availableTimes,
          profilePicture: updates.profilePicture,
          introduction: updates.introduction,
          photos: updates.photos,
          videos: updates.videos,
        };

        await Trainer.findOneAndUpdate({ user: userId }, trainerUpdates, {
          new: true,
        }).select("-password");
      }

      return res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;
