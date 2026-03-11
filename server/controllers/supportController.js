const Ticket = require('../models/Ticket');

// @desc    Create ticket
// @route   POST /api/support
// @access  Private
const createTicket = async (req, res) => {
    try {
        const { subject, message } = req.body;
        const ticket = await Ticket.create({
            user: req.user._id,
            subject,
            message,
        });
        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user tickets
// @route   GET /api/support
// @access  Private
const getTickets = async (req, res) => {
    try {
        let tickets;
        if (req.user.role === 'support' || req.user.role === 'doctor') {
            tickets = await Ticket.find().populate('user', 'name email').sort({ createdAt: -1 });
        } else {
            tickets = await Ticket.find({ user: req.user._id }).sort({ createdAt: -1 });
        }
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createTicket, getTickets };
