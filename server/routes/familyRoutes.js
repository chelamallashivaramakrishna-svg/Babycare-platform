const express = require('express');
const router = express.Router();
const { createFamily, getFamily, getAllFamilies } = require('../controllers/familyController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createFamily);
router.get('/', protect, getFamily);
router.get('/all', protect, getAllFamilies);

module.exports = router;
