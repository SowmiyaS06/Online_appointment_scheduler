const express = require('express');
const { authenticateToken, authorize, auditLog } = require('../middleware/auth');
const {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  cancelAppointment,
  deleteAppointment
} = require('../controllers/appointmentController');

const router = express.Router();

// Create appointment
router.post('/', authenticateToken, createAppointment);

// Get appointments
router.get('/', authenticateToken, getAppointments);

// Get single appointment
router.get('/:id', authenticateToken, getAppointment);

// Update appointment
router.put('/:id', authenticateToken, updateAppointment);

// Cancel appointment
router.put('/:id/cancel', authenticateToken, cancelAppointment);

// Delete appointment (admin only)
router.delete('/:id', authenticateToken, authorize('admin'), deleteAppointment);

module.exports = router;
