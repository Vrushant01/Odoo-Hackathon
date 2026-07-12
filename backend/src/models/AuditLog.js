const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'STATUS_CHANGE']
  },
  module: {
    type: String,
    required: true,
    enum: ['Auth', 'Vehicles', 'Drivers', 'Trips', 'Maintenance', 'FuelLogs', 'Expenses', 'Settings']
  },
  oldValue: {
    type: mongoose.Schema.Types.Mixed
  },
  newValue: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: {
    type: String
  },
  device: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for fast audit review querying
AuditLogSchema.index({ module: 1, timestamp: -1 });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
