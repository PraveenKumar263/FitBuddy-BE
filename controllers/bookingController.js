const Booking = require("../models/booking");
const Class = require("../models/class");
const { convertToUTC } = require("../utils/dateUtils");

const bookingController = {
  createBooking: async (req, res) => {
    try {
      const { userId, classId, scheduleId } = req.body;

      // Find class and schedule
      const classDetails = await Class.findById(classId);
      const schedule = classDetails.schedule.id(scheduleId);
      if (!schedule) {
        return res.status(400).json({ message: "Schedule not found" });
      }

      // Check if there are available slots
      if (schedule.slotsAvailable <= 0) {
        return res.status(400).json({ message: "No available slots" });
      }

      // Update available slots
      schedule.slotsAvailable -= 1;

      // Save booking
      const newBooking = new Booking({
        class: classId,
        schedule: scheduleId,
        user: userId,
      });
      const savedBooking = await newBooking.save();

      return res.status(201).json(savedBooking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getUserBookings: async (req, res) => {
    try {
      const { userId } = req.params;

      // Find all bookings for the user
      const bookings = await Booking.find({ user: userId }).populate("class");

      return res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getBookingById: async (req, res) => {
    try {
      const { bookingId } = req.params;

      // Find all bookings for the user
      const bookings = await Booking.findById(bookingId).populate("class");

      return res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateBooking: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const updatedData = req.body;

      // Update booking details
      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        updatedData,
        { new: true }
      );
      if (!updatedBooking) {
        return res.status(400).json({ message: "Booking not found" });
      }

      return res.json(updatedBooking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteBooking: async (req, res) => {
    try {
      const { bookingId } = req.params;

      // Delete booking
      const deletedBooking = await Booking.findByIdAndDelete(bookingId);
      if (!deletedBooking) {
        return res.status(400).json({ message: "Booking not found" });
      }

      return res.json({ message: "Booking deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  rescheduleBooking: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { newStartTime, newEndTime } = req.body;

      // Convert new times to UTC
      const newStartTimeUtc = convertToUTC(new Date(newStartTime));
      const newEndTimeUtc = convertToUTC(new Date(newEndTime));

      // Get the booking to be rescheduled
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(400).json({ message: "Booking not found" });
      }

      // Get the class and schedule
      const classDetails = await Class.findById(booking.class);
      if (!classDetails) {
        return res.status(400).json({ message: "Class not found" });
      }

      // Filter schedule
      const schedule = classDetails.schedule.find(
        (s) => s.startTime <= newStartTimeUtc && s.endTime >= newEndTimeUtc
      );
      if (!schedule) {
        return res.status(400).json({ message: "Schedule not available" });
      }

      // Check if there are available slots
      if (schedule.slotsAvailable <= 0) {
        return res.status(400).json({ message: "No available slots" });
      }

      // Update the booking with new times
      booking.startTime = newStartTimeUtc;
      booking.endTime = newEndTimeUtc;
      booking.date = new Date(newStartTimeUtc).toISOString().split("T")[0];

      await booking.save();

      // Update available slots for the new time slot
      schedule.slotsAvailable -= 1;

      // Update slots for the old time slot
      classDetails.schedule.find((s) => {
        if (s.startTime <= booking.startTime && s.endTime >= booking.endTime) {
          s.slotsAvailable += 1;
        }
      });

      await classDetails.save();

      return res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  cancelBooking: async (req, res) => {
    try {
      const { bookingId } = req.params;

      // Get the booking
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(400).json({ message: "Booking not found" });
      }

      // Get the class and schedule
      const classDetails = await Class.findById(booking.class);
      if (!classDetails) {
        return res.status(400).json({ message: "Class not found" });
      }

      classDetails.schedule.find((s) => {
        if (s.startTime <= booking.startTime && s.endTime >= booking.endTime) {
          s.slotsAvailable += 1;
        }
      });

      // Delete booking
      await Booking.findByIdAndDelete(bookingId);

      // Update class details
      await classDetails.save();

      return res
        .status(200)
        .json({ message: "Booking cancelled successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = bookingController;
