const express = require('express');
const passport = require('passport');
const { authenticateToken } = require('../middleware/auth');
const {
  register,
  login,
  googleCallback,
  getMe,
  logout,
  changePassword
} = require('../controllers/authController');

const router = express.Router();

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  googleCallback
);

// Get current user
router.get('/me', authenticateToken, getMe);

// Logout
router.post('/logout', authenticateToken, logout);

// Change password
router.put('/change-password', authenticateToken, changePassword);

module.exports = router;
