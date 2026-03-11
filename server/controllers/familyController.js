const Family = require('../models/Family');
const User = require('../models/User');

// @desc    Create a new family
// @route   POST /api/family
// @access  Private
const createFamily = async (req, res) => {
    try {
        const { name } = req.body;

        // Check if user already has a family
        // For simplicity, assuming 1 user = 1 family for now or multiple?
        // User model doesn't have familyId yet. I need to add it or use Family.parents array.

        const family = await Family.create({
            name,
            parents: [req.user._id],
            inviteCode: Math.random().toString(36).substring(7).toUpperCase(),
        });

        // Update user with family id? Or just rely on Family document?
        // Let's rely on Family document for now, or add familyId to User.

        res.status(201).json(family);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's family
// @route   GET /api/family
// @access  Private
const getFamily = async (req, res) => {
    try {
        let family;
        if (req.user.role === 'child') {
            family = await Family.findById(req.user.family)
                .populate('parents', 'name email')
                .populate('children');
        } else {
            family = await Family.findOne({ parents: req.user._id })
                .populate('parents', 'name email')
                .populate('children');
        }

        if (family) {
            res.json(family);
        } else {
            res.status(404).json({ message: 'Family not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all families (for doctors)
// @route   GET /api/family/all
// @access  Private (Doctor)
const getAllFamilies = async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const families = await Family.find().populate('parents', 'name email').populate('children');
        res.json(families);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createFamily, getFamily, getAllFamilies };
