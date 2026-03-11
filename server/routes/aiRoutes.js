const express = require('express');
const router = express.Router();
const { askChatbot, getHealthPredictions } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/chat', protect, askChatbot);
router.get('/predict/:childId', protect, getHealthPredictions);

module.exports = router;
