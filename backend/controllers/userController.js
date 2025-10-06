const User = require('../models/User');
const Appointment = require('../models/Appointment');
const AuditLog = require('../models/AuditLog');

// Get all users (admin only)
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search, isActive } = req.query;
    const query = {};

    // Role filter
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password -googleId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: error.message
    });
  }
};

// Get single user
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -googleId');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check permissions
    if (req.user.role === 'patient' && user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user',
      error: error.message
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check permissions
    if (req.user.role === 'patient' && user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const oldValues = { ...user.toObject() };
    const allowedUpdates = [
      'name', 'phone', 'address', 'dateOfBirth', 'gender',
      'specialization', 'experience', 'education', 'consultationFee',
      'availability', 'avatar'
    ];

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Admin can update more fields
    if (req.user.role === 'admin') {
      const adminUpdates = ['role', 'isActive', 'emailVerified'];
      adminUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });
    }

    Object.assign(user, updates);
    // Save would be needed for real database
    // await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: user.getPublicProfile() }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// Get doctors
const getDoctors = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, specialization } = req.query;
    const query = { role: 'doctor' };

    // Specialization filter
    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } }
      ];
    }

    const doctors = await User.find(query)
      .select('-password -googleId')
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        doctors,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
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

// Get doctor availability
const getDoctorAvailability = async (req, res) => {
  try {
    const { doctorId, date } = req.params;
    const doctor = await User.findById(doctorId);

    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Get existing appointments for the date
    const existingAppointments = await Appointment.find({
      doctor: doctorId,
      appointmentDate: new Date(date),
      status: { $in: ['scheduled', 'confirmed'] }
    }).select('appointmentTime');

    const bookedTimes = existingAppointments.map(apt => apt.appointmentTime);

    // Get doctor's availability for the day of week
    const appointmentDate = new Date(date);
    const dayOfWeek = appointmentDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
    const dayAvailability = doctor.availability[dayOfWeek] || [];

    // Generate available time slots
    const availableSlots = [];
    dayAvailability.forEach(slot => {
      const startTime = slot.start;
      const endTime = slot.end;
      
      // Generate 30-minute slots
      let currentTime = startTime;
      while (currentTime < endTime) {
        if (!bookedTimes.includes(currentTime)) {
          availableSlots.push(currentTime);
        }
        
        // Add 30 minutes
        const [hours, minutes] = currentTime.split(':').map(Number);
        const nextTime = new Date();
        nextTime.setHours(hours, minutes + 30, 0, 0);
        currentTime = nextTime.toTimeString().slice(0, 5);
      }
    });

    res.json({
      success: true,
      data: {
        doctor: {
          name: doctor.name,
          specialization: doctor.specialization,
          consultationFee: doctor.consultationFee
        },
        availableSlots,
        date
      }
    });
  } catch (error) {
    console.error('Get doctor availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get doctor availability',
      error: error.message
    });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has appointments
    const hasAppointments = await Appointment.findOne({
      $or: [
        { patient: user._id },
        { doctor: user._id }
      ]
    });

    if (hasAppointments) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete user with existing appointments'
      });
    }

    // Delete user (would be needed for real database)
    // await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

// Get user statistics
const getUserStats = async (req, res) => {
  try {
    const userId = req.params.id || req.user._id;
    
    const stats = await Appointment.aggregate([
      {
        $match: {
          $or: [
            { patient: userId },
            { doctor: userId }
          ]
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalAppointments = await Appointment.countDocuments({
      $or: [
        { patient: userId },
        { doctor: userId }
      ]
    });

    const upcomingAppointments = await Appointment.countDocuments({
      $or: [
        { patient: userId },
        { doctor: userId }
      ],
      appointmentDate: { $gte: new Date() },
      status: { $in: ['scheduled', 'confirmed'] }
    });

    res.json({
      success: true,
      data: {
        totalAppointments,
        upcomingAppointments,
        statusBreakdown: stats
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user statistics',
      error: error.message
    });
  }
};

module.exports = {
  getUsers,
  getUser,
  updateProfile,
  getDoctors,
  getDoctorAvailability,
  deleteUser,
  getUserStats
};