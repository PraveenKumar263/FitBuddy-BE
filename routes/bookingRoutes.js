const express = require("express");
const bookingController = require("../controllers/bookingController");
const auth = require("../utils/auth");

const bookingRouter = express.Router();

// Create a new booking
bookingRouter.post("/", auth.verifyToken, bookingController.createBooking);

// Get all bookings for a user
bookingRouter.get(
  "/user/:userId",
  auth.verifyToken,
  bookingController.getUserBookings
);

// Get booking by bookingId
bookingRouter.get(
  "/:bookingId",
  auth.verifyToken,
  bookingController.getBookingById
);

// Update all booking status by userId
bookingRouter.put(
  "/status-all",
  auth.verifyToken,
  bookingController.updateAllBookingStatusByUserId
);

// Update a booking by bookingId
bookingRouter.put(
  "/:bookingId",
  auth.verifyToken,
  bookingController.updateBooking
);

// Reschedule a booking by bookingId
bookingRouter.put(
  "/reschedule/:bookingId",
  auth.verifyToken,
  bookingController.rescheduleBooking
);

// Cancel a booking by bookingId
bookingRouter.put(
  "/cancel/:bookingId",
  auth.verifyToken,
  bookingController.cancelBooking
);

// Delete a booking by bookingId
bookingRouter.delete(
  "/:bookingId",
  auth.verifyToken,
  bookingController.deleteBooking
);

module.exports = bookingRouter;
