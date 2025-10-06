const express = require('express');
const User = require('../models/User');
const { authenticateToken, authorize, auditLog } = require('../middleware/auth');
const {
  getUsers,
  getUser,
  updateProfile,
  getDoctors,
  getDoctorAvailability,
  deleteUser,
  getUserStats
} = require('../controllers/userController');

const router = express.Router();

console.log('Users router loaded');

// Get users by role (public for doctors, admin for all)
router.get('/', async (req, res) => {
  try {
    console.log('Route /api/users GET called');
    const { role } = req.query;
    const query = role ? { role } : {};
    
    console.log('Route /api/users called with query:', req.query);
    
    // If requesting doctors, make it public
    if (role === 'doctor') {
      console.log('Finding doctors with query:', { role: 'doctor' });
      const findResult = User.find({ role: 'doctor' });
      console.log('Find result:', findResult);
      console.log('Find result type:', typeof findResult);
      console.log('Has select method:', typeof findResult.select);
      
      const doctors = await findResult.select('-password -googleId');
      console.log('Doctors found:', doctors);
      return res.json(doctors);
    }
    
    // For other roles, require authentication
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'Access token required' });
    }
    
    const users = await User.find(query).select('-password -googleId');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to get users', error: error.message });
  }
});

// Get doctors (public)
router.get('/doctors', getDoctors);

// Get doctor availability
router.get('/doctors/:doctorId/availability/:date', getDoctorAvailability);

// Get user statistics
router.get('/stats', authenticateToken, getUserStats);
router.get('/stats/:id', authenticateToken, getUserStats);

// Get single user
router.get('/:id', authenticateToken, getUser);

// Update user profile
router.put('/:id', authenticateToken, updateProfile);

// Delete user (admin only)
router.delete('/:id', authenticateToken, authorize('admin'), deleteUser);

module.exports = router;