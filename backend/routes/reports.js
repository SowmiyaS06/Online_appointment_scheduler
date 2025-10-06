const express = require('express');
const { authenticateToken, authorize } = require('../middleware/auth');
const {
  getDashboardAnalytics,
  getAppointmentTrends,
  getDoctorPerformance,
  exportData,
  generateReport,
  getDoctors,
  exportReportCSV
} = require('../controllers/reportController');

const router = express.Router();

// All routes require admin access
router.use(authenticateToken, authorize('admin'));

// Get dashboard analytics
router.get('/dashboard', getDashboardAnalytics);

// Get appointment trends
router.get('/trends', getAppointmentTrends);

// Get doctor performance
router.get('/doctor-performance', getDoctorPerformance);

// Export data
router.get('/export', exportData);

// Dynamic report generation
router.post('/', generateReport);

// Get available doctors for filtering
router.get('/doctors', getDoctors);

// Export report to CSV
router.post('/export-csv', exportReportCSV);

module.exports = router;
