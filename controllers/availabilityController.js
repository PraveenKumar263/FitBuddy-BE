const Availability = require("../models/availability");
const { convertToUTC } = require("../utils/dateUtils");

const availabilityController = {
  createAvailability: async (req, res) => {
    try {
      const { trainerId, date, selectedSlots, timeZone } = req.body;

      // Convert available slots to UTC
      const convertedSlots = selectedSlots.map((slot) => ({
        startTime: convertToUTC(new Date(slot.startTime), timeZone),
        endTime: convertToUTC(new Date(slot.endTime), timeZone),
      }));

      // Find the trainer's availability or create a new one if it doesn't exist
      let availability = await Availability.findOne({ trainer: trainerId });

      if (!availability) {
        availability = new Availability({
          trainer: trainerId,
          availableSlots: [],
        });
      }

      // Check if the date already exists in availableSlots
      const existingDate = availability.availableSlots.find(
        (slot) =>
          new Date(slot.date).toDateString() === new Date(date).toDateString()
      );

      if (existingDate) {
        // Update the existing slots for the date
        existingDate.slots = convertedSlots;
      } else {
        // Add new date with slots
        availability.availableSlots.push({ date, slots: convertedSlots });
      }

      // Save or update availability
      const savedAvailability = await availability.save();

      return res.status(201).json(savedAvailability);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getAvailabilityByTrainer: async (req, res) => {
    try {
      const { trainerId } = req.params;

      // Fetch trainer's availability
      const availability = await Availability.findOne({ trainer: trainerId });

      if (!availability) {
        return res.status(203).json({ message: "No slots available" });
      }

      return res.json(availability);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteAvailability: async (req, res) => {
    try {
      const { slotId } = req.params;

      // Find the availability document and remove the slot
      const availability = await Availability.findOneAndUpdate(
        { "availableSlots.slots._id": slotId },
        { $pull: { "availableSlots.$.slots": { _id: slotId } } },
        { new: true }
      );

      if (!availability) {
        return res.status(404).json({ message: "Availability slot not found" });
      }

      // If all slots for the date are removed, remove the date entry
      availability.availableSlots = availability.availableSlots.filter(
        (slot) => slot.slots.length > 0
      );

      // Save the updated availability
      await availability.save();

      return res.json({
        message: "Availability slot deleted successfully",
        availability,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = availabilityController;
