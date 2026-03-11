const express = require('express');
const router = express.Router();
const { createTicket, getTickets } = require('../controllers/supportController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createTicket);
router.get('/', protect, getTickets);

module.exports = router;
