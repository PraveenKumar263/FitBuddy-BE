const express = require("express");
const userController = require("../controllers/userController");
const userRouter = express.Router();
const auth = require("../utils/auth");

// Get user details
userRouter.get("/me", auth.verifyToken, userController.getUserDetails);

// Update user details
userRouter.put("/me", auth.verifyToken, userController.updateUserDetails);

module.exports = userRouter;
