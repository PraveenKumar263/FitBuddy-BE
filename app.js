// Imports
const express = require('express');
const authRouter = require('./routes/authRoutes');
const app = express();
const cors = require('cors');
const { FRONTEND_URL } = require('./utils/config');
const cookieParser = require('cookie-parser');

const whiteList = [FRONTEND_URL, 'http://localhost:5173'];

// CORS config
const corsOptions = {
    origin: (origin, callback) => {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

// Use the cors middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Pre-flight request handling

// Middleware to parse request as json
app.use(express.json());

// Use the cookie parser middleware
app.use(cookieParser());

// Routes
app.use('/api/v1/auth', authRouter);

// Optional: Add logging middleware for debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

module.exports = app;