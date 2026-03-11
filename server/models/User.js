const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['parent', 'doctor', 'support'],
        default: 'parent',
    },
    phone: {
        type: String,
    },
    specialization: { // For doctors
        type: String,
    },
    maxTokensPerDay: {
        type: Number,
        default: 20
    },
    availability: {
        startTime: {
            type: String,
            default: "09:00" // 9 AM
        },
        endTime: {
            type: String,
            default: "17:00" // 5 PM
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
