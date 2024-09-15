// Imports
const mongoose = require('mongoose');

// Create a new schema
const classSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    type: {
        type: String,
        enum: ['yoga', 'strength training', 'cardio', 'other'],
        required: true
    },
    duration: { type: Number, required: true },
    schedule: [{
        date: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
    }],
    capacity: { type: Number, required: true },
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    }],
    rating: { type: Number, min: 0, max: 5 },
    tags: [String],
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer',
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Class', classSchema, 'classes');
