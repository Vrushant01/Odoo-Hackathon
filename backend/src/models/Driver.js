const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    profileImage: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address'
      ]
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    emergencyContact: {
      name: { type: String, trim: true },
      relation: { type: String, trim: true },
      phone: { type: String, trim: true }
    },
    dateOfBirth: {
      type: Date
    },
    address: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    },
    joiningDate: {
      type: Date,
      default: Date.now
    },
    experience: {
      type: Number,
      min: [0, 'Experience cannot be negative']
    },
    bloodGroup: {
      type: String,
      trim: true
    },
    licenseNumber: {
      type: String,
      required: [true, 'License number is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    licenseCategory: {
      type: String,
      required: [true, 'License category is required'],
      enum: {
        values: ['LMV', 'HMV', 'Transport', 'Commercial', 'Heavy Vehicle', 'Custom'],
        message: 'License category must be LMV, HMV, Transport, Commercial, Heavy Vehicle, or Custom'
      }
    },
    licenseIssueDate: {
      type: Date
    },
    licenseExpiryDate: {
      type: Date,
      required: [true, 'License expiry date is required']
    },
    licenseDocument: {
      type: String,
      default: ''
    },
    governmentId: {
      type: String,
      default: ''
    },
    medicalCertificate: {
      type: String,
      default: ''
    },
    policeVerification: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: {
        values: ['Available', 'On Trip', 'Off Duty', 'Suspended', 'License Expired'],
        message: 'Status must be Available, On Trip, Off Duty, Suspended, or License Expired'
      },
      default: 'Available'
    },
    safetyScore: {
      type: Number,
      default: 100,
      min: [0, 'Safety score cannot be less than 0'],
      max: [100, 'Safety score cannot exceed 100']
    },
    assignedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle'
    },
    currentTrip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip'
    },
    remarks: {
      type: String,
      trim: true
    },
    // Audit logs
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    // Soft Delete Fields
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Indexes
DriverSchema.index({ isDeleted: 1 });

module.exports = mongoose.model('Driver', DriverSchema);
