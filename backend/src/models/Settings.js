const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      default: 'TransitOps Fleet Management',
      trim: true
    },
    companyLogo: {
      type: String,
      default: ''
    },
    defaultRegion: {
      type: String,
      default: 'North',
      trim: true
    },
    defaultCurrency: {
      type: String,
      default: 'USD',
      trim: true
    },
    fuelUnit: {
      type: String,
      enum: ['Liters', 'Gallons'],
      default: 'Liters'
    },
    distanceUnit: {
      type: String,
      enum: ['Kilometers', 'Miles'],
      default: 'Kilometers'
    },
    timezone: {
      type: String,
      default: 'UTC',
      trim: true
    },
    emailSettings: {
      host: { type: String, trim: true },
      port: { type: Number },
      secure: { type: Boolean, default: false },
      senderEmail: { type: String, trim: true }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Settings', SettingsSchema);
