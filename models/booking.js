// Imports
const mongoose = require('mongoose');

// Create a new schema
const bookingSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    status: {
        type: String,
        enum: ['Booked', 'Cancelled', 'Completed'],
        default: 'Booked'
    },
},
    {
        timestamps: true
    });

// Create a new model and export it
module.exports = mongoose.model('Booking', bookingSchema, 'bookings');
