const express = require('express');
const router = express.Router();
const { addHealthRecord, getHealthRecords } = require('../controllers/healthController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.array('attachments'), addHealthRecord);
router.get('/:childId', protect, getHealthRecords);

module.exports = router;
