const crypto = require("crypto");
const { FRONTEND_URL } = require("./config");
const sendEmail = require("./emailSender");
const User = require("../models/user");

const generateToken = () => {
  return crypto.randomBytes(20).toString("hex");
};

const sendActivationEmail = async (email) => {
  const activationToken = generateToken();
  const activationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 1 day

  // Activation link
  const activateLink = `${FRONTEND_URL}/activate?token=${activationToken}`;

  // Update activation token in the database
  await User.updateOne(
    { email },
    { $set: { activationToken, activationTokenExpiry } }
  );

  try {
    // Send activation email
    await sendEmail(
      email,
      "Reset Password",
      `Please use the following link to reset your password: ${activateLink}`
    );
  } catch (error) {
    throw new Error("Failed to send activation email. Please try again later");
  }
  return "Activation email sent. Please check your email, including";
};

const sendPasswordReset = async (email) => {
  const resetToken = generateToken();
  const resetTokenExpiry = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

  // Reset link
  const resetLink = `${FRONTEND_URL}/reset?token=${resetToken}&expires=${resetTokenExpiry}`;

  // Update reset token in the database
  await User.updateOne({ email }, { $set: { resetToken, resetTokenExpiry } });

  try {
    // Send reset password email
    await sendEmail(
      email,
      "Reset password",
      `Please use the following link to reset your password: ${resetLink}`
    );
  } catch (error) {
    throw new Error(
      "Failed to send password reset email. Please try again later"
    );
  }
  return "Reset password email sent. Please check your email, including";
};

module.exports = { sendActivationEmail, sendPasswordReset };
