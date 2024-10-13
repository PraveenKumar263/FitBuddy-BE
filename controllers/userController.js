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

      return res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateProfilePicture: async (req, res) => {
    try {
      const userId = req.userId;
      const { profilePicture } = req.body;

      // Update profile picture
      const updatedUser = await User.findByIdAndUpdate(userId, profilePicture, {
        new: true,
      });
      if (!updatedUser) {
        return res.status(400).json({ message: "User not found" });
      }

      return res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userController;
