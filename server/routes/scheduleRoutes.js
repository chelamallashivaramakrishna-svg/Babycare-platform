const express = require('express');
const router = express.Router();
const { getSchedule, updateSchedule } = require('../controllers/scheduleController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:childId', protect, getSchedule);
router.post('/:childId', protect, updateSchedule);

module.exports = router;
