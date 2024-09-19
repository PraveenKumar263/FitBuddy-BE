const Class = require("../models/class");

// Calculate user preferences based on their past interactions
const calculateUserPreferences = (user, bookings) => {
  const preferredTypes = user.preferences.classTypes || [];
  const preferredIntensity = user.preferences.intensity || [];
  const preferredDuration = user.preferences.duration || [];

  // Check past bookings to refine preferences
  bookings.forEach((booking) => {
    if (booking.classType && !preferredTypes.includes(booking.classType)) {
      preferredTypes.push(booking.classType);
    }

    if (booking.intensity && !preferredIntensity.includes(booking.intensity)) {
      preferredIntensity.push(booking.intensity);
    }

    if (booking.duration && !preferredDuration.includes(booking.duration)) {
      preferredDuration.push(booking.duration);
    }
  });

  return {
    types: preferredTypes,
    intensity: preferredIntensity,
    duration: preferredDuration,
  };
};
// Function to find similar classes based on user preferences and past bookings
const findSimilarClasses = async (user, bookings) => {
  // Calculate user preferences
  const {
    types: preferredTypes,
    intensity: preferredIntensity,
    duration: preferredDuration,
  } = calculateUserPreferences(user, bookings);

  // Query to get classess match user preferences
  const query = {};
  if (preferredTypes.length > 0) {
    query.type = { $in: preferredTypes };
  }
  if (preferredIntensity.length > 0) {
    query.intensity = { $in: preferredIntensity };
  }
  if (preferredDuration.length > 0) {
    query.duration = { $in: preferredDuration };
  }

  try {
    // Get classes matching user preferences
    const recommendedClasses = await Class.find(query).limit(5);
    return recommendedClasses;
  } catch (error) {
    throw new Error("Unable to find similar classes");
  }
};

module.exports = { calculateUserPreferences, findSimilarClasses };
