const mongoose = require('mongoose');

const TripTimelineSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  eventType: {
    type: String,
    required: true,
    enum: [
      'Trip Created',
      'Driver Assigned',
      'Vehicle Assigned',
      'Trip Updated',
      'Trip Dispatched',
      'Checkpoint Reached',
      'Fuel Added',
      'Expense Added',
      'Trip Completed',
      'Trip Cancelled'
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
TripTimelineSchema.index({ tripId: 1, createdAt: -1 });

module.exports = mongoose.model('TripTimeline', TripTimelineSchema);
