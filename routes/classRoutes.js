const express = require("express");
const classRouter = express.Router();
const classController = require("../controllers/classController");
const auth = require("../utils/auth");

// Get featured classes
classRouter.get("/featured", classController.getFeaturedClasses);

// Get all classes
classRouter.get("/", classController.getAllClasses);

// Get a specific class by classId
classRouter.get("/:classId", classController.getClassById);

// Get a classes by trainerId
classRouter.get(
  "/trainer/:trainerId",
  auth.verifyToken,
  classController.getAllClassesByTrainerId
);

// Create a new class
classRouter.post(
  "/",
  auth.verifyToken,
  auth.isTrainer,
  classController.createClass
);

// Update a class by classId
classRouter.put(
  "/:classId",
  auth.verifyToken,
  auth.isTrainer,
  classController.updateClass
);

// Delete a class by classId
classRouter.delete(
  "/:classId",
  auth.verifyToken,
  auth.isTrainer,
  classController.deleteClass
);

module.exports = classRouter;
