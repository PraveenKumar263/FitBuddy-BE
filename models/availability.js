// Imports
const mongoose = require('mongoose');

// Create a new schema
const availabilitySchema = mongoose.Schema({
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer',
        required: true
    },
    availableSlots: [{
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true }
    }],
},
    {
        timestamps: true
    });

// Create a new model and export it
module.exports = mongoose.model('Availability', availabilitySchema, 'availabilities');
