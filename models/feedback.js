// Imports
const mongoose = require('mongoose');

// Create a new schema
const feedbackSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer',
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: String,
},
    {
        timestamps: true
    });

// Create a new model and export it
module.exports = mongoose.model('Feedback', feedbackSchema, 'feedbacks');
