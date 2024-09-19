const express = require("express");
const recommendationController = require("../controllers/recommendationController");
const auth = require("../utils/auth");

const recommendationRouter = express.Router();

// Get all recommendations for a user
recommendationRouter.get(
  "/",
  auth.verifyToken,
  recommendationController.getClassRecommendations
);

module.exports = recommendationRouter;
