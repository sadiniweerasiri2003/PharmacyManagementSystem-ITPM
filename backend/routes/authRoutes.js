const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Register route
router.post('/register', registerUser);
// Login route
router.post('/login', loginUser);

module.exports = router;
