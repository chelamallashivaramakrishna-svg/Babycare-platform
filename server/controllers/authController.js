const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Child = require('../models/Child');
const Family = require('../models/Family');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role, phone, specialization } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            phone,
            specialization,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const childLogin = async (req, res) => {
    const { inviteCode, pin, childId } = req.body;

    try {
        const family = await Family.findOne({ inviteCode });
        if (!family) return res.status(401).json({ message: 'Invalid Invite Code' });

        const children = await Child.find({ family: family._id });

        let child;
        if (childId) {
            child = children.find(c => c._id.toString() === childId && c.pin === pin);
        } else {
            child = children.find(c => c.pin === pin);
        }

        if (!child) return res.status(401).json({ message: 'Invalid PIN' });

        res.json({
            _id: child._id,
            name: child.name,
            role: 'child',
            token: generateToken(child._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, childLogin };
