const express = require('express');
const router = express.Router();
const { createChild, getChildren, updateScreenTime, getChild, awardStar, updateGameScore, updateGameLevel, updateChild } = require('../controllers/childController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createChild);
router.get('/family/:familyId', protect, getChildren);
router.put('/:childId/screentime', protect, updateScreenTime);
router.put('/:childId/stars', protect, awardStar);
router.put('/:childId/game-score', protect, updateGameScore);
router.put('/:childId/levels', protect, updateGameLevel);
router.get('/:childId', protect, getChild);
router.put('/:childId', protect, updateChild);

module.exports = router;
