const express = require('express');
const router = express.Router();
const {
    bookAppointment,
    getAppointments,
    updateAppointmentStatus,
    getDoctors,
    getChildAppointments,
    getDoctorAvailability
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, bookAppointment);
router.get('/', protect, getAppointments);
router.put('/:id/status', protect, updateAppointmentStatus);
router.get('/doctors', protect, getDoctors);
router.get('/doctors/:id/availability', protect, getDoctorAvailability);
router.get('/child/:childId', protect, getChildAppointments);

module.exports = router;
