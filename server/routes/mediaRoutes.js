const express = require('express');
const router = express.Router();
const { getMedia, addMedia } = require('../controllers/mediaController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMedia);
router.post('/', protect, addMedia);

module.exports = router;
