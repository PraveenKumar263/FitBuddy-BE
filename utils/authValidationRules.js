const { check } = require("express-validator");

const registerRule = [
  check("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isString()
    .withMessage("First name must be a string"),
  check("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isString()
    .withMessage("Last name must be a string"),
  check("email").trim().isEmail().withMessage("Invalid email address"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 8 characters long"),
  check("role").notEmpty().withMessage("User role not specified"),
];

const loginRule = [
  check("email").trim().isEmail().withMessage("Invalid email address"),
  check("password").notEmpty().withMessage("Password is required"),
];

const forgotRule = [
  check("email").trim().isEmail().withMessage("Invalid email address"),
];

const resetRule = [
  check("newPassword")
    .isLength({ min: 6, max: 12 })
    .withMessage("Password must be at least 6-12 characters long"),
];

// Export auth validation rules
module.exports = {
  validateRegister: registerRule,
  validateLogin: loginRule,
  validateForgotPassword: forgotRule,
  validatePasswordReset: resetRule,
};
