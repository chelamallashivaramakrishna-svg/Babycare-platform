const mongoose = require('mongoose');

const familySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    parents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Child',
    }],
    inviteCode: {
        type: String,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Family', familySchema);
