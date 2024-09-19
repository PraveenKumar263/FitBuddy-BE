const Availability = require("../models/availability");
const Booking = require("../models/booking");

const checkAvailabilityOverlap = async (
  trainerId,
  startTimeUtc,
  endTimeUtc
) => {
  try {
    // Check for overlapping availability slots
    const availability = await Availability.findOne({
      trainer: trainerId,
      availableSlots: {
        $elemMatch: {
          startTime: { $lt: endTimeUtc },
          endTime: { $gt: startTimeUtc },
        },
      },
    });

    // If no availability found, return false
    if (!availability) {
      return false;
    }

    // Check for conflicting bookings
    const bookingConflict = await Booking.findOne({
      class: { $exists: true },
      startTime: { $lt: endTimeUtc },
      endTime: { $gt: startTimeUtc },
    });

    return bookingConflict === null;
  } catch (error) {
    throw new Error("Error checking availability overlap: " + error.message);
  }
};

module.exports = { checkAvailabilityOverlap };
