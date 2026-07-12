const mongoose = require('mongoose');

const DriverTimelineSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  eventType: {
    type: String,
    required: true,
    enum: [
      'Driver Registered',
      'License Updated',
      'Vehicle Assigned',
      'Trip Started',
      'Trip Completed',
      'License Renewed',
      'Suspended',
      'Activated',
      'Profile Updated'
    ]
  },
  description: {
    type: String,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for fast timeline queries ordered by date
DriverTimelineSchema.index({ driverId: 1, createdAt: -1 });

module.exports = mongoose.model('DriverTimeline', DriverTimelineSchema);
