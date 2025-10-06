const mongoose = require('mongoose');
const mockDatabase = require('../services/mockDatabase');

// Flag to check if MongoDB is available
let useMockDatabase = false;

// Check if MongoDB is available by trying to connect
try {
  // Check if MONGODB_URI is set
  if (!process.env.MONGODB_URI) {
    console.log('⚠️  MONGODB_URI not found in environment variables, using mock database for appointments');
    useMockDatabase = true;
  } else {
    // Check if we're actually connected to MongoDB
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️  Not connected to MongoDB, using mock database for appointments');
      useMockDatabase = true;
    }
  }
} catch (error) {
  console.log('⚠️  Error checking MongoDB connection, using mock database for appointments:', error.message);
  useMockDatabase = true;
}

const appointmentSchema = new mongoose.Schema({
  patient: useMockDatabase ? {
    type: String,
    required: true
  } : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: useMockDatabase ? {
    type: String,
    required: true
  } : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  appointmentTime: {
    type: String,
    required: [true, 'Appointment time is required']
  },
  duration: {
    type: Number,
    default: 30 // in minutes
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'scheduled'
  },
  reason: {
    type: String,
    required: [true, 'Reason for appointment is required'],
    maxlength: [500, 'Reason cannot be more than 500 characters']
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  // Doctor's notes after appointment
  doctorNotes: {
    type: String,
    maxlength: [1000, 'Doctor notes cannot be more than 1000 characters']
  },
  // Prescription details
  prescription: {
    medications: [{
      name: String,
      dosage: String,
      frequency: String,
      duration: String,
      instructions: String
    }],
    followUpDate: Date,
    followUpNotes: String
  },
  // Payment information
  payment: {
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'online', 'insurance']
    },
    transactionId: String,
    paidAt: Date
  },
  // Reminder settings
  reminders: {
    email: {
      enabled: { type: Boolean, default: true },
      sent: { type: Boolean, default: false },
      sentAt: Date
    },
    sms: {
      enabled: { type: Boolean, default: false },
      sent: { type: Boolean, default: false },
      sentAt: Date
    }
  },
  // Cancellation details
  cancelledBy: useMockDatabase ? {
    type: String,
    ref: 'User'
  } : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelledAt: Date,
  cancellationReason: String,
  // Completion details
  completedAt: Date,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    maxlength: [500, 'Review cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

// Index for efficient queries
appointmentSchema.index({ patient: 1, appointmentDate: 1 });
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ appointmentDate: 1, appointmentTime: 1 });

// Virtual for checking if appointment is in the past
appointmentSchema.virtual('isPast').get(function() {
  if (!this.appointmentDate || !this.appointmentTime) return false;
  const now = new Date();
  const [hours, minutes] = this.appointmentTime.split(':').map(Number);
  const appointmentDateTime = new Date(this.appointmentDate);
  appointmentDateTime.setHours(hours, minutes, 0, 0);
  return appointmentDateTime < now;
});

// Virtual for checking if appointment is today
appointmentSchema.virtual('isToday').get(function() {
  if (!this.appointmentDate) return false;
  const today = new Date();
  const appointmentDate = new Date(this.appointmentDate);
  return appointmentDate.toDateString() === today.toDateString();
});

// Method to check if appointment can be cancelled
appointmentSchema.methods.canBeCancelled = function() {
  if (!this.appointmentDate || !this.appointmentTime) return false;
  const now = new Date();
  const [hours, minutes] = this.appointmentTime.split(':').map(Number);
  const appointmentDateTime = new Date(this.appointmentDate);
  appointmentDateTime.setHours(hours, minutes, 0, 0);
  const hoursUntilAppointment = (appointmentDateTime - now) / (1000 * 60 * 60);
  
  return (this.status === 'scheduled' || this.status === 'confirmed') && hoursUntilAppointment > 2;
};

// Method to check if appointment can be rescheduled
appointmentSchema.methods.canBeRescheduled = function() {
  if (!this.appointmentDate || !this.appointmentTime) return false;
  const now = new Date();
  const [hours, minutes] = this.appointmentTime.split(':').map(Number);
  const appointmentDateTime = new Date(this.appointmentDate);
  appointmentDateTime.setHours(hours, minutes, 0, 0);
  const hoursUntilAppointment = (appointmentDateTime - now) / (1000 * 60 * 60);
  
  return (this.status === 'scheduled' || this.status === 'confirmed') && hoursUntilAppointment > 24;
};

// Method to automatically update appointment status based on date/time
appointmentSchema.methods.updateStatusBasedOnTime = function() {
  const now = new Date();
  const [hours, minutes] = this.appointmentTime.split(':').map(Number);
  const appointmentDateTime = new Date(this.appointmentDate);
  appointmentDateTime.setHours(hours, minutes, 0, 0);
  
  // If appointment is in the past and still scheduled/confirmed, mark as completed
  if (appointmentDateTime < now && (this.status === 'scheduled' || this.status === 'confirmed')) {
    this.status = 'completed';
    this.completedAt = now;
    return true; // Status was updated
  }
  
  return false; // Status was not updated
};

// Static method to update all appointments' statuses
appointmentSchema.statics.updateAllAppointmentStatuses = async function() {
  try {
    const now = new Date();
    const filter = {
      status: { $in: ['scheduled', 'confirmed'] },
      appointmentDate: { $lt: now }
    };
    
    const update = {
      $set: {
        status: 'completed',
        completedAt: now
      }
    };
    
    if (useMockDatabase) {
      // For mock database, we need to manually update each appointment
      const appointments = await this.find(filter);
      let updatedCount = 0;
      
      for (const appointment of appointments) {
        if (appointment.updateStatusBasedOnTime()) {
          await this.findByIdAndUpdate(appointment._id, {
            status: 'completed',
            completedAt: now
          });
          updatedCount++;
        }
      }
      
      return { modifiedCount: updatedCount };
    } else {
      // For real database, use MongoDB's updateMany
      return await this.updateMany(filter, update);
    }
  } catch (error) {
    console.error('Error updating appointment statuses:', error);
    return { modifiedCount: 0 };
  }
};

// Mock query builder to handle method chaining
class MockQuery {
  constructor(result, isFind = false) {
    this.result = result;
    this.isFind = isFind;
  }
  
  sort() {
    // For mock database, we'll sort in the find method itself
    return this;
  }
  
  limit(limit) {
    if (Array.isArray(this.result) && this.isFind) {
      this.result = this.result.slice(0, limit);
    }
    return this;
  }
  
  skip(skip) {
    if (Array.isArray(this.result) && this.isFind) {
      this.result = this.result.slice(skip);
    }
    return this;
  }
  
  select() {
    return this; // Allow chaining
  }
  
  populate() {
    return this; // Allow chaining
  }
  
  then(onFulfilled, onRejected) {
    // Make it thenable so it works with await
    return Promise.resolve(this.result).then(onFulfilled, onRejected);
  }
  
  catch(onRejected) {
    return Promise.resolve(this.result).catch(onRejected);
  }
  
  // Make it iterable
  [Symbol.iterator]() {
    if (Array.isArray(this.result)) {
      return this.result[Symbol.iterator]();
    }
    return [this.result][Symbol.iterator]();
  }
}

// Mock database methods
appointmentSchema.statics.mockFindOne = async function(query) {
  const appointments = await mockDatabase.findAppointments(query);
  return appointments.length > 0 ? appointments[0] : null;
};

appointmentSchema.statics.mockFind = async function(query) {
  const appointments = await mockDatabase.findAppointments(query);
  // Sort by appointmentDate and appointmentTime in descending order (most recent first)
  appointments.sort((a, b) => {
    const dateA = new Date(a.appointmentDate);
    const dateB = new Date(b.appointmentDate);
    if (dateA.getTime() !== dateB.getTime()) {
      return dateB.getTime() - dateA.getTime(); // Descending by date
    }
    return b.appointmentTime.localeCompare(a.appointmentTime); // Descending by time
  });
  return appointments;
};

appointmentSchema.statics.mockCreate = async function(appointmentData) {
  return await mockDatabase.createAppointment(appointmentData);
};

appointmentSchema.statics.mockFindById = async function(id) {
  return await mockDatabase.findAppointmentById(id);
};

appointmentSchema.statics.mockUpdateOne = async function(query, updateData) {
  const appointments = await mockDatabase.findAppointments(query);
  if (appointments.length > 0) {
    return await mockDatabase.updateAppointment(appointments[0]._id, updateData);
  }
  return null;
};

appointmentSchema.statics.mockFindByIdAndUpdate = async function(id, updateData) {
  return await mockDatabase.updateAppointment(id, updateData);
};

appointmentSchema.statics.mockCountDocuments = async function(query) {
  const appointments = await mockDatabase.findAppointments(query);
  return appointments.length;
};

// Export model with fallback to mock database
let Appointment;
if (useMockDatabase) {
  // Use mock database
  Appointment = {
    findOne: function(query) {
      console.log('Mock Appointment.findOne called with query:', query);
      return new MockQuery(appointmentSchema.statics.mockFindOne(query));
    },
    find: function(query) {
      console.log('Mock Appointment.find called with query:', query);
      return new MockQuery(appointmentSchema.statics.mockFind(query), true);
    },
    create: appointmentSchema.statics.mockCreate,
    findById: function(id) {
      return new MockQuery(appointmentSchema.statics.mockFindById(id));
    },
    updateOne: appointmentSchema.statics.mockUpdateOne,
    findByIdAndUpdate: appointmentSchema.statics.mockFindByIdAndUpdate,
    countDocuments: appointmentSchema.statics.mockCountDocuments,
    updateAllAppointmentStatuses: appointmentSchema.statics.updateAllAppointmentStatuses,
    schema: appointmentSchema
  };
} else {
  try {
    Appointment = mongoose.model('Appointment', appointmentSchema);
  } catch (error) {
    // If model already exists, use existing model
    Appointment = mongoose.model('Appointment');
  }
}

module.exports = Appointment;