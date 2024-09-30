const Class = require("../models/class");
const { convertFromUTC } = require("../utils/dateUtils");
const Bookings = require("../models/booking");

const classController = {
  createClass: async (req, res) => {
    try {
      const {
        startTime,
        endTime,
        trainerId,
        timeZone,
        capacity,
        ...classData
      } = req.body;

      // Convert startTime and endTime to Date objects and then to UTC
      const startTimeDate = new Date(startTime);
      const endTimeDate = new Date(endTime);

      const durationInMinutes = Math.ceil(
        (endTimeDate - startTimeDate) / (1000 * 60)
      );

      // Check trainer's class schedule clash
      const isClassClash = await Class.findOne({
        trainer: trainerId,
        $or: [
          {
            startTime: { $lt: endTimeUtc },
            endTime: { $gt: startTimeUtc },
          },
        ],
      });
      if (isClassClash) {
        return res
          .status(400)
          .json({ message: "Class time conflicts with an existing class." });
      }

      // Create and save the new class
      const newClass = new Class({
        ...classData,
        startTime: startTimeDate,
        endTime: endTimeDate,
        timeZone,
        capacity,
        duration: durationInMinutes,
        slotsAvailable: capacity,
        trainer: trainerId,
      });
      const savedClass = await newClass.save();

      return res.status(201).json(savedClass);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getAllClasses: async (req, res) => {
    try {
      // Get all classes
      const classes = await Class.find();

      return res.json(classes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getAllClassesByTrainerId: async (req, res) => {
    try {
      const { trainerId } = req.params;
      // Get all classes
      const classes = await Class.find({ trainer: trainerId });

      return res.json(classes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getClassById: async (req, res) => {
    try {
      const { classId } = req.params;

      // Find class by id
      const classes = await Class.findById(classId);
      if (!classes) {
        return res.status(400).json({ message: "Class not found" });
      }

      return res.json(classes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getClassSchedules: async (req, res) => {
    try {
      const { classId } = req.params;

      // Get class
      const classData = await Class.findById(classId);
      if (!classData) {
        return res.status(404).json({ message: "Class not found" });
      }

      // Get class schedules
      const schedules = classData.schedule.map((sched) => ({
        date: sched.date,
        startTime: sched.startTime,
        endTime: sched.endTime,
        capacity: sched.capacity,
        slotsAvailable: sched.slotsAvailable,
      }));

      return res.json(schedules);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateClass: async (req, res) => {
    try {
      const { classId } = req.params;
      const { startTime, endTime, capacity, bookings } = req.body;

      const startDate = new Date(startTime);
      const endDate = new Date(endTime);

      const durationInMinutes = Math.ceil((endDate - startDate) / (1000 * 60));

      const countConfirmedBookings =
        (await Bookings.countDocuments({
          class: classId,
          status: "Booked",
        })) || 0;

      const newSlotsAvailable = capacity - countConfirmedBookings;
      const updatedClass = {
        ...req.body,
        startTime: startDate,
        endTime: endDate,
        slotsAvailable: newSlotsAvailable,
        duration: durationInMinutes,
      };

      // Update class, if found
      const savedClass = await Class.findByIdAndUpdate(classId, updatedClass, {
        new: true,
      });
      if (!savedClass) {
        return res.status(400).json({ message: "Class not found" });
      }

      return res.json(savedClass);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteClass: async (req, res) => {
    try {
      const { classId } = req.params;

      // Update class, if found
      const deletedClass = await Class.findByIdAndDelete(classId, req.body, {
        new: true,
      });
      if (!deletedClass) {
        return res.status(400).json({ message: "Class not found" });
      }

      return res.json("Class deleted successfully");
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getFeaturedClasses: async (req, res) => {
    try {
      // Get all classes
      const classes = await Class.find().sort({ rating: -1 }).limit(3);

      return res.json(classes || []);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = classController;
