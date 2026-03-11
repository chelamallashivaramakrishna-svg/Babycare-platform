const Appointment = require('../models/Appointment');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private (Parent)
const fs = require('fs');
const path = require('path');

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private (Parent)
const bookAppointment = async (req, res) => {
    const { doctorId, childId, date, reason } = req.body;
    try {
        const reqDate = new Date(date);
        const startOfDay = new Date(reqDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(reqDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Find doctor info
        const doctor = await User.findById(doctorId);
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Check if doctor's daily token limit is reached
        const appointmentCount = await Appointment.countDocuments({
            doctor: doctorId,
            date: {
                $gte: startOfDay,
                $lt: endOfDay
            },
            status: { $ne: 'cancelled' }
        });

        const maxTokens = doctor.maxTokensPerDay || 20;
        if (appointmentCount >= maxTokens) {
            return res.status(400).json({ message: 'Token limit reached for this date. Please select another date.' });
        }

        // Check if time is within availability (basic check)
        const reqTimeStr = reqDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); // 24hr format HH:mm
        const startTime = (doctor.availability && doctor.availability.startTime) || "09:00";
        const endTime = (doctor.availability && doctor.availability.endTime) || "17:00";

        if (reqTimeStr < startTime || reqTimeStr > endTime) {
            return res.status(400).json({ message: `Time is outside doctor's availability (${startTime} - ${endTime}).` });
        }

        const appointment = await Appointment.create({
            doctor: doctorId,
            parent: req.user._id,
            child: childId,
            date,
            reason,
        });
        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get appointments for logged in user
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
    try {
        // Explicitly cast to ObjectId to ensure matching works
        const userId = new mongoose.Types.ObjectId(req.user._id);
        console.log(`Fetching appointments for Role: ${req.user.role}, UserID: ${userId}`);

        let appointments;
        if (req.user.role === 'doctor') {
            appointments = await Appointment.find({ doctor: userId })
                .populate('parent', 'name email phone')
                .populate('child', 'name age')
                .sort({ date: 1 });
        } else {
            appointments = await Appointment.find({ parent: userId })
                .populate('doctor', 'name specialization')
                .populate('child', 'name')
                .sort({ date: 1 });
        }
        console.log(`Found ${appointments.length} appointments`);
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private (Doctor)
const updateAppointmentStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Ensure only the assigned doctor can update status
        if (appointment.doctor.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        appointment.status = status;
        const updatedAppointment = await appointment.save();

        res.json(updatedAppointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all doctors
// @route   GET /api/appointments/doctors
// @access  Private
const getDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' }).select('-password');
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getChildAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ child: req.params.childId })
            .populate('doctor', 'name specialization')
            .sort({ date: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get doctor availability for a specific date
// @route   GET /api/appointments/doctors/:id/availability?date=YYYY-MM-DD
// @access  Private
const getDoctorAvailability = async (req, res) => {
    try {
        const { date } = req.query;
        const doctorId = req.params.id;

        if (!date) {
            return res.status(400).json({ message: 'Date is required' });
        }

        const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Parse requested date
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Count existing appointments for this doctor on this day
        const appointmentCount = await Appointment.countDocuments({
            doctor: doctorId,
            date: {
                $gte: startOfDay,
                $lt: endOfDay
            },
            status: { $ne: 'cancelled' } // Don't count cancelled appointments
        });

        const maxTokens = doctor.maxTokensPerDay || 20;
        const availableTokens = Math.max(0, maxTokens - appointmentCount);

        res.json({
            availableTokens,
            maxTokens,
            availability: doctor.availability || { startTime: "09:00", endTime: "17:00" }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    bookAppointment,
    getAppointments,
    updateAppointmentStatus,
    getDoctors,
    getChildAppointments,
    getDoctorAvailability
};
