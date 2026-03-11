const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
    family: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Family',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
    },
    bloodGroup: {
        type: String,
    },
    allergies: [String],
    pediatrician: {
        name: String,
        phone: String,
    },
    pin: { // For child login
        type: String,
    },
    growthMetrics: [{
        date: { type: Date, default: Date.now },
        height: Number, // cm
        weight: Number, // kg
        headCircumference: Number, // cm
    }],
    vaccinations: [{
        name: String,
        dateGiven: Date,
        dueDate: Date,
        status: {
            type: String,
            enum: ['pending', 'completed', 'missed'],
            default: 'pending',
        },
    }],
    screenTimeLimit: {
        type: Number, // minutes per day
        default: 60,
    },
    screenTimeUsed: { // Reset daily via cron or logic
        type: Number,
        default: 0,
    },
    stars: { // Gamification - awarded for completing tasks
        type: Number,
        default: 0,
    },
    gameScores: {
        brain: { type: Number, default: 0 },
        educational: { type: Number, default: 0 },
        fun: { type: Number, default: 0 }
    },
    completedLevels: [{
        gameId: { type: String, required: true },
        currentLevel: { type: Number, default: 1 },
        maxLevelUnlocked: { type: Number, default: 1 }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Child', childSchema);
