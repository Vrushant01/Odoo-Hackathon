const mongoose = require('mongoose');

const VehicleTimelineSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  eventType: {
    type: String,
    required: true,
    enum: [
      'Vehicle Registered',
      'Vehicle Updated',
      'Trip Assigned',
      'Trip Completed',
      'Maintenance Scheduled',
      'Maintenance Started',
      'Maintenance Completed',
      'Fuel Added',
      'Expense Added',
      'Vehicle Returned',
      'Vehicle Retired'
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
VehicleTimelineSchema.index({ vehicleId: 1, createdAt: -1 });

module.exports = mongoose.model('VehicleTimeline', VehicleTimelineSchema);
