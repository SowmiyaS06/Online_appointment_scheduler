const Appointment = require('../models/Appointment');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const ReportService = require('../services/reportService');

// Get dashboard analytics
const getDashboardAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};

    if (startDate || endDate) {
      dateFilter.appointmentDate = {};
      if (startDate) dateFilter.appointmentDate.$gte = new Date(startDate);
      if (endDate) dateFilter.appointmentDate.$lte = new Date(endDate);
    }

    // Total appointments
    const totalAppointments = await Appointment.countDocuments(dateFilter);

    // Appointments by status
    const appointmentsByStatus = await Appointment.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Appointments by doctor
    const appointmentsByDoctor = await Appointment.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$doctor',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'doctor'
        }
      },
      {
        $unwind: '$doctor'
      },
      {
        $project: {
          doctorName: '$doctor.name',
          specialization: '$doctor.specialization',
          count: 1
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Appointments per day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const appointmentsPerDay = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: { $gte: thirtyDaysAgo },
          ...dateFilter
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$appointmentDate' },
            month: { $month: '$appointmentDate' },
            day: { $dayOfMonth: '$appointmentDate' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Revenue analytics
    const revenueData = await Appointment.aggregate([
      {
        $match: {
          ...dateFilter,
          'payment.status': 'paid'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$payment.amount' },
          averageRevenue: { $avg: '$payment.amount' }
        }
      }
    ]);

    // User statistics
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recent activities
    const recentActivities = await AuditLog.find()
      .populate('user', 'name email')
      .sort({ timestamp: -1 })
      .limit(10)
      .select('action resource details timestamp user');

    res.json({
      success: true,
      data: {
        totalAppointments,
        appointmentsByStatus,
        appointmentsByDoctor,
        appointmentsPerDay,
        revenue: revenueData[0] || { totalRevenue: 0, averageRevenue: 0 },
        userStats,
        recentActivities
      }
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard analytics',
      error: error.message
    });
  }
};

// Get appointment trends
const getAppointmentTrends = async (req, res) => {
  try {
    const { period = 'month', startDate, endDate } = req.query;
    const dateFilter = {};

    if (startDate || endDate) {
      dateFilter.appointmentDate = {};
      if (startDate) dateFilter.appointmentDate.$gte = new Date(startDate);
      if (endDate) dateFilter.appointmentDate.$lte = new Date(endDate);
    }

    let groupFormat;
    switch (period) {
      case 'day':
        groupFormat = {
          year: { $year: '$appointmentDate' },
          month: { $month: '$appointmentDate' },
          day: { $dayOfMonth: '$appointmentDate' }
        };
        break;
      case 'week':
        groupFormat = {
          year: { $year: '$appointmentDate' },
          week: { $week: '$appointmentDate' }
        };
        break;
      case 'month':
      default:
        groupFormat = {
          year: { $year: '$appointmentDate' },
          month: { $month: '$appointmentDate' }
        };
        break;
    }

    const trends = await Appointment.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: groupFormat,
          total: { $sum: 1 },
          confirmed: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.json({
      success: true,
      data: { trends }
    });
  } catch (error) {
    console.error('Get appointment trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get appointment trends',
      error: error.message
    });
  }
};

// Get doctor performance
const getDoctorPerformance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};

    if (startDate || endDate) {
      dateFilter.appointmentDate = {};
      if (startDate) dateFilter.appointmentDate.$gte = new Date(startDate);
      if (endDate) dateFilter.appointmentDate.$lte = new Date(endDate);
    }

    const doctorPerformance = await Appointment.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$doctor',
          totalAppointments: { $sum: 1 },
          confirmedAppointments: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
          },
          cancelledAppointments: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          },
          completedAppointments: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          totalRevenue: {
            $sum: {
              $cond: [
                { $eq: ['$payment.status', 'paid'] },
                '$payment.amount',
                0
              ]
            }
          },
          averageRating: { $avg: '$rating' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'doctor'
        }
      },
      {
        $unwind: '$doctor'
      },
      {
        $project: {
          doctorName: '$doctor.name',
          specialization: '$doctor.specialization',
          totalAppointments: 1,
          confirmedAppointments: 1,
          cancelledAppointments: 1,
          completedAppointments: 1,
          totalRevenue: 1,
          averageRating: 1,
          confirmationRate: {
            $multiply: [
              { $divide: ['$confirmedAppointments', '$totalAppointments'] },
              100
            ]
          },
          completionRate: {
            $multiply: [
              { $divide: ['$completedAppointments', '$totalAppointments'] },
              100
            ]
          }
        }
      },
      { $sort: { totalAppointments: -1 } }
    ]);

    res.json({
      success: true,
      data: { doctorPerformance }
    });
  } catch (error) {
    console.error('Get doctor performance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get doctor performance',
      error: error.message
    });
  }
};

// Export data
const exportData = async (req, res) => {
  try {
    const { type, format = 'excel', startDate, endDate } = req.query;
    const dateFilter = {};

    if (startDate || endDate) {
      dateFilter.appointmentDate = {};
      if (startDate) dateFilter.appointmentDate.$gte = new Date(startDate);
      if (endDate) dateFilter.appointmentDate.$lte = new Date(endDate);
    }

    let data, filename;

    switch (type) {
      case 'appointments':
        data = await Appointment.find(dateFilter)
          .populate('patient', 'name email phone')
          .populate('doctor', 'name specialization')
          .sort({ appointmentDate: -1 });
        filename = 'appointments';
        break;
      case 'users':
        data = await User.find({ isActive: true })
          .select('-password -googleId')
          .sort({ createdAt: -1 });
        filename = 'users';
        break;
      case 'audit_logs':
        data = await AuditLog.find()
          .populate('user', 'name email')
          .sort({ timestamp: -1 })
          .limit(1000);
        filename = 'audit_logs';
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid export type'
        });
    }

    // Log export action
    await AuditLog.logAction({
      user: req.user._id,
      action: 'EXPORT_DATA',
      resource: 'REPORT',
      details: `Exported ${type} data in ${format} format`,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });

    if (format === 'excel') {
      // Excel export logic would go here
      res.json({
        success: true,
        message: 'Excel export functionality will be implemented',
        data: { count: data.length }
      });
    } else if (format === 'pdf') {
      // PDF export logic would go here
      res.json({
        success: true,
        message: 'PDF export functionality will be implemented',
        data: { count: data.length }
      });
    } else {
      res.json({
        success: true,
        data: { [filename]: data }
      });
    }
  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export data',
      error: error.message
    });
  }
};

// Generate dynamic reports
const generateReport = async (req, res) => {
  try {
    const { type, filters = {} } = req.body;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Report type is required'
      });
    }

    let data;
    let reportTitle;

    switch (type) {
      case 'appointments_per_doctor':
        data = await ReportService.getAppointmentsPerDoctor(filters);
        reportTitle = 'Appointments per Doctor';
        break;
      
      case 'appointments_per_day':
        data = await ReportService.getAppointmentsPerDay(filters);
        reportTitle = 'Appointments per Day';
        break;
      
      case 'patients_count':
        data = await ReportService.getPatientsCount(filters);
        reportTitle = 'Patients Count';
        break;
      
      case 'appointment_status_distribution':
        data = await ReportService.getAppointmentStatusDistribution(filters);
        reportTitle = 'Appointment Status Distribution';
        break;
      
      case 'monthly_revenue':
        data = await ReportService.getMonthlyRevenue(filters);
        reportTitle = 'Monthly Revenue';
        break;
      
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type'
        });
    }

    // Log report generation
    await AuditLog.logAction({
      user: req.user._id,
      action: 'GENERATE_REPORT',
      resource: 'REPORT',
      details: `Generated ${reportTitle} report with filters: ${JSON.stringify(filters)}`,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      data: {
        type,
        title: reportTitle,
        filters,
        generatedAt: new Date(),
        data
      }
    });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report',
      error: error.message
    });
  }
};

// Get available doctors for filtering
const getDoctors = async (req, res) => {
  try {
    const doctors = await ReportService.getDoctors();
    
    res.json({
      success: true,
      data: doctors
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get doctors',
      error: error.message
    });
  }
};

// Export report to CSV
const exportReportCSV = async (req, res) => {
  try {
    const { type, filters = {} } = req.body;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Report type is required'
      });
    }

    let data;
    let filename;

    switch (type) {
      case 'appointments_per_doctor':
        data = await ReportService.getAppointmentsPerDoctor(filters);
        filename = 'appointments_per_doctor';
        break;
      
      case 'appointments_per_day':
        data = await ReportService.getAppointmentsPerDay(filters);
        filename = 'appointments_per_day';
        break;
      
      case 'patients_count':
        const patientsData = await ReportService.getPatientsCount(filters);
        data = patientsData.patients;
        filename = 'patients_count';
        break;
      
      case 'appointment_status_distribution':
        data = await ReportService.getAppointmentStatusDistribution(filters);
        filename = 'appointment_status_distribution';
        break;
      
      case 'monthly_revenue':
        data = await ReportService.getMonthlyRevenue(filters);
        filename = 'monthly_revenue';
        break;
      
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type'
        });
    }

    const csvContent = ReportService.exportToCSV(data, type);
    const timestamp = new Date().toISOString().split('T')[0];
    const finalFilename = `${filename}_${timestamp}.csv`;

    // Log export action
    await AuditLog.logAction({
      user: req.user._id,
      action: 'EXPORT_REPORT_CSV',
      resource: 'REPORT',
      details: `Exported ${type} report to CSV`,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${finalFilename}"`);
    res.send(csvContent);
  } catch (error) {
    console.error('Export report CSV error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export report to CSV',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardAnalytics,
  getAppointmentTrends,
  getDoctorPerformance,
  exportData,
  generateReport,
  getDoctors,
  exportReportCSV
};
