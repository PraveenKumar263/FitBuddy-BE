const Class = require("../models/class");
const { checkAvailabilityOverlap } = require("../utils/availabilityUtils");
const { convertToUTC } = require("../utils/dateUtils");

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
      const startTimeUtc = convertToUTC(startTimeDate, timeZone);
      const endTimeUtc = convertToUTC(endTimeDate, timeZone);

      // Class schedule
      const schedule = [
        {
          date: startTimeDate.toISOString().split("T")[0],
          startTime: startTimeUtc,
          endTime: endTimeUtc,
          capacity: capacity,
          slotsAvailable: capacity,
        },
      ];

      const durationInMinutes = Math.round(
        (endTimeDate - startTimeDate) / (1000 * 60)
      );

      // Check for overlapping availability and bookings
      const isAvailable = await checkAvailabilityOverlap(
        trainerId,
        startTimeUtc,
        endTimeUtc
      );
      if (!isAvailable) {
        return res
          .status(400)
          .json({ message: "No available slot for the class" });
      }

      // Create and save the new class
      const newClass = new Class({
        ...classData,
        duration: durationInMinutes,
        schedule,
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

      // Update class, if found
      const updatedClass = await Class.findByIdAndUpdate(classId, req.body, {
        new: true,
      });
      if (!updatedClass) {
        return res.status(400).json({ message: "Class not found" });
      }

      return res.json(updatedClass);
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
};

module.exports = classController;
