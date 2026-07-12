const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true
    },
    type: {
      type: String,
      required: [true, 'Notification type is required'],
      enum: {
        values: [
          'License Expiring',
          'License Expired',
          'Vehicle Maintenance Due',
          'Maintenance Completed',
          'Trip Assigned',
          'Trip Completed',
          'Fuel Added',
          'Expense Added',
          'Vehicle Retired',
          'Vehicle Returned'
        ],
        message: 'Invalid notification type'
      }
    },
    isRead: {
      type: Boolean,
      default: false
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);
