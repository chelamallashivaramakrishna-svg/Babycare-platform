const express = require('express');
const router = express.Router();
const { registerUser, loginUser, childLogin } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/child-login', childLogin);

module.exports = router;
