const Booking = require("../models/booking");
const User = require("../models/user");
const { findSimilarClasses } = require("../utils/recommendationUtils");

const recommendationController = {
  getClassRecommendations: async (req, res) => {
    try {
      const userId = req.userId;

      // Get user
      const user = await User.findById(userId);

      // Get past bookings
      const bookings = await Booking.find({ user: userId });

      // Get recommendations
      const recommendedClasses = await findSimilarClasses(user, bookings);

      return res.json(recommendedClasses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = recommendationController;
