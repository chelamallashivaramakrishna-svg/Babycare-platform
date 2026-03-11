const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    time: {
        type: String, // e.g., "08:00 AM"
        required: true,
    },
    activity: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
    }
});

const scheduleSchema = new mongoose.Schema({
    child: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Child',
        required: true,
    },
    activities: [activitySchema],
}, {
    timestamps: true,
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
