// Imports
const express = require("express");
const authRouter = require("./routes/authRoutes");
const app = express();
const cors = require("cors");
const { FRONTEND_URL } = require("./utils/config");
const cookieParser = require("cookie-parser");
const classRouter = require("./routes/classRoutes");
const trainerRouter = require("./routes/trainerRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const feedbackRouter = require("./routes/feedbackRoutes");
const recommendationRouter = require("./routes/recommendationRoutes");
const userRouter = require("./routes/userRoutes");
const paymentRouter = require("./routes/paymentRoutes");

const whiteList = [FRONTEND_URL, "http://localhost:5173"];

// CORS config
const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// Use the cors middleware
app.use(cors(corsOptions));

// Middleware to parse request as json
app.use(express.json());

// Use the cookie parser middleware
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/trainers", trainerRouter);
app.use("/api/v1/classes", classRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/feedback", feedbackRouter);
app.use("/api/v1/recommendations", recommendationRouter);
app.use("/api/v1/payment", paymentRouter);

// Add logging middleware for debugging
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next();
// });

module.exports = app;
