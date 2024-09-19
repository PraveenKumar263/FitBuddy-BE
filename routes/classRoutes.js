const express = require("express");
const classRouter = express.Router();
const classController = require("../controllers/classController");
const auth = require("../utils/auth");

// Create a new class
classRouter.post(
  "/",
  auth.verifyToken,
  auth.isTrainer,
  classController.createClass
);

// Get all classes
classRouter.get("/", auth.verifyToken, classController.getAllClasses);

// Get a classes by trainerId
classRouter.get(
  "/:trainerId",
  auth.verifyToken,
  classController.getAllClassesByTrainerId
);

// Get a specific class by classId
classRouter.get("/:classId", auth.verifyToken, classController.getClassById);

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
