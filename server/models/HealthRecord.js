const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
    child: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Child',
        required: true,
    },
    type: {
        type: String,
        enum: ['vaccination', 'growth', 'visit', 'other', 'prescription'],
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    title: {
        type: String, // e.g., "6 Month Checkup", "Rotavirus Vaccine"
        required: true,
    },
    notes: {
        type: String,
    },
    metrics: { // For growth
        height: Number, // cm
        weight: Number, // kg
        headCircumference: Number, // cm
    },
    attachments: [{ // File paths/URLs
        name: String,
        url: String,
        type: { type: String }, // pdf, image
    }],
    doctor: { // If uploaded by doctor
        name: String,
        id: mongoose.Schema.Types.ObjectId,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
