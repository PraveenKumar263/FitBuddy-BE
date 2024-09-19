// Imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { SALT_ROUNDS, SECRET_KEY } = require("../utils/config");
const Trainer = require("../models/trainer");
const mongoose = require("mongoose");
const {
  sendActivationEmail,
  sendPasswordReset,
} = require("../utils/userUtils");

const authController = {
  register: async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { firstName, lastName, email, password, role } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // Create and save new user
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
      });
      const savedUser = await newUser.save({ session });

      // Create Trainer user
      if (role === "trainer") {
        const newTrainer = new Trainer({ user: savedUser._id });
        await newTrainer.save({ session });
      }

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      // Send activation email
      const sentEmail = await sendActivationEmail(email);
      return res.json({ message: sentEmail });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ message: error.message });
    }
  },
  activate: async (req, res) => {
    try {
      let { activationToken } = req.body;

      // Find user by activation token and check token expiry
      const user = await User.findOne({
        activationToken,
        activationTokenExpiry: { $gt: Date.now() },
      });
      if (!user) {
        return res
          .status(400)
          .json({ message: "Expired or invalid activation link" });
      }

      const email = user.email;
      // Send activation email
      const sentEmail = await sendActivationEmail(email);
      if (sentEmail) return res.status(400).json({ message: sentEmail });

      // Activate account and clear token
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            isActive: true,
            activationToken: "",
            activationTokenExpiry: null,
          },
        }
      );
      return res.json({ message: "Account activated" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ message: "Account not found or invalid credentials" });
      }

      // Check if account is activated, else send email
      if (!user.isActive) {
        const sentEmail = await sendActivationEmail(email);
        if (sentEmail) return res.status(400).json({ message: sentEmail });
      }

      // Compare password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        SECRET_KEY,
        { expiresIn: "1d" }
      );

      // Store the token in the cookie
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      return res.json({ message: "Login successful" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  forgot: async (req, res) => {
    try {
      const { email } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ message: "An email will be sent, if your" });
      }

      // Check if account is activated, else send email
      if (!user.isActive) {
        const sentEmail = await sendActivationEmail(email);
        if (sentEmail) return res.status(400).json({ message: sentEmail });
      }

      // Generate reset link and expiry timestamp
      const resetToken = randomstring.generate(20);
      const expiryTimeStamp = Date.now() + 60 * 60 * 1000; // 1 hour

      // Store reset token and expiry timestamp
      await User.updateOne(
        { email },
        { $set: { resetToken, resetTokenExpiry: expiryTimeStamp } }
      );

      // Send reset password email
      const sentEmail = await sendPasswordReset(email);
      return res.status(200).json({ message: sentEmail });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  reset: async (req, res) => {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;

      // Verify reset token and expiry
      const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() },
      });
      if (!user) {
        return res
          .status(400)
          .json({ message: "Reset link has expired or is invalid" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

      // Update password and clear reset token
      await User.updateOne(
        { resetToken: token },
        {
          $set: {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null,
          },
        }
      );

      return res.json({ message: "Password reset successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("token").json({ message: "Logout successful" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = authController;
