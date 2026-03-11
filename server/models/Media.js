const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['Stories', 'Education', 'Entertainment'],
        required: true,
    },
    ageRange: {
        min: Number,
        max: Number,
    },
    approved: {
        type: Boolean,
        default: true, // Auto-approve for demo
    },
    thumbnail: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Media', mediaSchema);
