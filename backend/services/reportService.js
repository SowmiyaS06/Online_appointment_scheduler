const Appointment = require('../models/Appointment');
const User = require('../models/User');

class ReportService {
  /**
   * Generate appointments per doctor report
   */
  static async getAppointmentsPerDoctor(filters = {}) {
    const { startDate, endDate, status } = filters;
    
    const matchStage = {};
    
    // Add date filter
    if (startDate || endDate) {
      matchStage.appointmentDate = {};
      if (startDate) {
        matchStage.appointmentDate.$gte = new Date(startDate);
      }
      if (endDate) {
        matchStage.appointmentDate.$lte = new Date(endDate);
      }
    }
    
    // Add status filter
    if (status) {
      matchStage.status = status;
    }

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: '$doctor',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$payment.amount' },
          avgRating: { $avg: '$rating' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'doctorInfo'
        }
      },
      {
        $unwind: '$doctorInfo'
      },
      {
        $project: {
          doctorId: '$_id',
          doctorName: '$doctorInfo.name',
          doctorSpecialty: '$doctorInfo.specialization',
          appointmentCount: '$count',
          totalRevenue: '$totalRevenue',
          avgRating: { $round: ['$avgRating', 2] }
        }
      },
      { $sort: { appointmentCount: -1 } }
    ];

    return await Appointment.aggregate(pipeline);
  }

  /**
   * Generate appointments per day report
   */
  static async getAppointmentsPerDay(filters = {}) {
    const { startDate, endDate, status, doctorId } = filters;
    
    const matchStage = {};
    
    // Add date filter
    if (startDate || endDate) {
      matchStage.appointmentDate = {};
      if (startDate) {
        matchStage.appointmentDate.$gte = new Date(startDate);
      }
      if (endDate) {
        matchStage.appointmentDate.$lte = new Date(endDate);
      }
    }
    
    // Add status filter
    if (status) {
      matchStage.status = status;
    }
    
    // Add doctor filter
    if (doctorId) {
      matchStage.doctor = doctorId;
    }

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$appointmentDate'
            }
          },
          count: { $sum: 1 },
          totalRevenue: { $sum: '$payment.amount' }
        }
      },
      {
        $project: {
          date: '$_id',
          appointmentCount: '$count',
          totalRevenue: '$totalRevenue'
        }
      },
      { $sort: { date: 1 } }
    ];

    return await Appointment.aggregate(pipeline);
  }

  /**
   * Generate patients count report
   */
  static async getPatientsCount(filters = {}) {
    const { startDate, endDate, status, doctorId } = filters;
    
    const matchStage = {};
    
    // Add date filter
    if (startDate || endDate) {
      matchStage.appointmentDate = {};
      if (startDate) {
        matchStage.appointmentDate.$gte = new Date(startDate);
      }
      if (endDate) {
        matchStage.appointmentDate.$lte = new Date(endDate);
      }
    }
    
    // Add status filter
    if (status) {
      matchStage.status = status;
    }
    
    // Add doctor filter
    if (doctorId) {
      matchStage.doctor = doctorId;
    }

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: '$patient',
          appointmentCount: { $sum: 1 },
          totalSpent: { $sum: '$payment.amount' },
          lastAppointment: { $max: '$appointmentDate' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'patientInfo'
        }
      },
      {
        $unwind: '$patientInfo'
      },
      {
        $project: {
          patientId: '$_id',
          patientName: '$patientInfo.name',
          patientEmail: '$patientInfo.email',
          appointmentCount: '$appointmentCount',
          totalSpent: '$totalSpent',
          lastAppointment: '$lastAppointment'
        }
      },
      { $sort: { appointmentCount: -1 } }
    ];

    const patients = await Appointment.aggregate(pipeline);
    
    return {
      totalPatients: patients.length,
      patients: patients,
      totalAppointments: patients.reduce((sum, p) => sum + p.appointmentCount, 0),
      totalRevenue: patients.reduce((sum, p) => sum + p.totalSpent, 0)
    };
  }

  /**
   * Generate appointment status distribution report
   */
  static async getAppointmentStatusDistribution(filters = {}) {
    const { startDate, endDate, doctorId } = filters;
    
    const matchStage = {};
    
    // Add date filter
    if (startDate || endDate) {
      matchStage.appointmentDate = {};
      if (startDate) {
        matchStage.appointmentDate.$gte = new Date(startDate);
      }
      if (endDate) {
        matchStage.appointmentDate.$lte = new Date(endDate);
      }
    }
    
    // Add doctor filter
    if (doctorId) {
      matchStage.doctor = doctorId;
    }

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$payment.amount' }
        }
      },
      {
        $project: {
          status: '$_id',
          count: '$count',
          totalRevenue: '$totalRevenue'
        }
      },
      { $sort: { count: -1 } }
    ];

    return await Appointment.aggregate(pipeline);
  }

  /**
   * Generate monthly revenue report
   */
  static async getMonthlyRevenue(filters = {}) {
    const { startDate, endDate, doctorId } = filters;
    
    const matchStage = {};
    
    // Add date filter
    if (startDate || endDate) {
      matchStage.appointmentDate = {};
      if (startDate) {
        matchStage.appointmentDate.$gte = new Date(startDate);
      }
      if (endDate) {
        matchStage.appointmentDate.$lte = new Date(endDate);
      }
    }
    
    // Add doctor filter
    if (doctorId) {
      matchStage.doctor = doctorId;
    }

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: '$appointmentDate' },
            month: { $month: '$appointmentDate' }
          },
          count: { $sum: 1 },
          totalRevenue: { $sum: '$payment.amount' },
          avgRevenue: { $avg: '$payment.amount' }
        }
      },
      {
        $project: {
          year: '$_id.year',
          month: '$_id.month',
          monthName: {
            $switch: {
              branches: [
                { case: { $eq: ['$_id.month', 1] }, then: 'January' },
                { case: { $eq: ['$_id.month', 2] }, then: 'February' },
                { case: { $eq: ['$_id.month', 3] }, then: 'March' },
                { case: { $eq: ['$_id.month', 4] }, then: 'April' },
                { case: { $eq: ['$_id.month', 5] }, then: 'May' },
                { case: { $eq: ['$_id.month', 6] }, then: 'June' },
                { case: { $eq: ['$_id.month', 7] }, then: 'July' },
                { case: { $eq: ['$_id.month', 8] }, then: 'August' },
                { case: { $eq: ['$_id.month', 9] }, then: 'September' },
                { case: { $eq: ['$_id.month', 10] }, then: 'October' },
                { case: { $eq: ['$_id.month', 11] }, then: 'November' },
                { case: { $eq: ['$_id.month', 12] }, then: 'December' }
              ],
              default: 'Unknown'
            }
          },
          appointmentCount: '$count',
          totalRevenue: '$totalRevenue',
          avgRevenue: { $round: ['$avgRevenue', 2] }
        }
      },
      { $sort: { year: 1, month: 1 } }
    ];

    return await Appointment.aggregate(pipeline);
  }

  /**
   * Get available doctors for filtering
   */
  static async getDoctors() {
    return await User.find({ role: 'doctor' })
      .select('_id name specialization')
      .sort({ name: 1 });
  }

  /**
   * Export data to CSV format
   */
  static exportToCSV(data, reportType) {
    if (!data || data.length === 0) {
      return 'No data available';
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle nested objects and arrays
          if (typeof value === 'object' && value !== null) {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }
          // Escape commas and quotes in string values
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    return csvContent;
  }
}

module.exports = ReportService;
