const express = require("express");
const authController = require("../controllers/authController");
const authRouter = express.Router();
const auth = require("../utils/auth");
const validate = require("../utils/validationMiddleware");
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validatePasswordReset,
} = require("../utils/authValidationRules");

// Register a new user
authRouter.post(
  "/register",
  validate(validateRegister),
  authController.register
);

// Activate user account
authRouter.put("/activate", authController.activate);

// Verify login of a user
authRouter.post("/login", validate(validateLogin), authController.login);

// Forgot password
authRouter.post(
  "/forgot",
  validate(validateForgotPassword),
  authController.forgot
);

// Reset password
authRouter.post(
  "/reset/:token",
  validate(validatePasswordReset),
  authController.reset
);

// User logout
authRouter.post("/logout", auth.verifyToken, authController.logout);

module.exports = authRouter;
