const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'CREATE', 'READ', 'UPDATE', 'DELETE',
      'LOGIN', 'LOGOUT', 'REGISTER',
      'BOOK_APPOINTMENT', 'CANCEL_APPOINTMENT', 'RESCHEDULE_APPOINTMENT',
      'UPDATE_PROFILE', 'CHANGE_PASSWORD',
      'EXPORT_DATA', 'SEND_EMAIL', 'SEND_SMS'
    ]
  },
  resource: {
    type: String,
    required: true,
    enum: ['USER', 'APPOINTMENT', 'AUDIT_LOG', 'REPORT', 'SYSTEM']
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: function() {
      return this.action !== 'LOGIN' && this.action !== 'LOGOUT' && this.action !== 'REGISTER';
    }
  },
  details: {
    type: String,
    maxlength: [1000, 'Details cannot be more than 1000 characters']
  },
  oldValues: {
    type: mongoose.Schema.Types.Mixed
  },
  newValues: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  success: {
    type: Boolean,
    default: true
  },
  errorMessage: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
auditLogSchema.index({ user: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ resource: 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 });

// Static method to log an action
auditLogSchema.statics.logAction = async function(data) {
  try {
    const auditLog = new this({
      user: data.user,
      action: data.action,
      resource: data.resource,
      resourceId: data.resourceId,
      details: data.details,
      oldValues: data.oldValues,
      newValues: data.newValues,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      success: data.success !== false,
      errorMessage: data.errorMessage
    });
    
    await auditLog.save();
    return auditLog;
  } catch (error) {
    console.error('Error creating audit log:', error);
    // Don't throw error to avoid breaking the main operation
  }
};

module.exports = mongoose.model('AuditLog', auditLogSchema);
