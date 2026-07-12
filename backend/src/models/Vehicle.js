const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    vehicleName: {
      type: String,
      required: [true, 'Vehicle name is required'],
      trim: true
    },
    vehicleModel: {
      type: String,
      required: [true, 'Vehicle model is required'],
      trim: true
    },
    manufacturer: {
      type: String,
      trim: true
    },
    vehicleType: {
      type: String,
      required: [true, 'Vehicle type is required'],
      enum: {
        values: ['Truck', 'Van', 'Sedan', 'SUV', 'Trailer'],
        message: 'Vehicle type must be Truck, Van, Sedan, SUV, or Trailer'
      }
    },
    fuelType: {
      type: String,
      enum: {
        values: ['Diesel', 'Petrol', 'Electric', 'CNG', 'Hybrid'],
        message: 'Fuel type must be Diesel, Petrol, Electric, CNG, or Hybrid'
      }
    },
    maximumLoadCapacity: {
      type: Number,
      required: [true, 'Maximum load capacity is required'],
      min: [0.01, 'Maximum capacity must be greater than zero']
    },
    currentOdometer: {
      type: Number,
      default: 0,
      min: [0, 'Current odometer reading cannot be negative']
    },
    acquisitionCost: {
      type: Number,
      default: 0,
      min: [0, 'Acquisition cost cannot be negative']
    },
    purchaseDate: {
      type: Date,
      required: [true, 'Purchase date is required'],
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: 'Purchase date cannot be a future date'
      }
    },
    insuranceNumber: {
      type: String,
      trim: true
    },
    insuranceExpiry: {
      type: Date
    },
    registrationCertificate: {
      type: String,
      default: ''
    },
    fitnessCertificate: {
      type: String,
      default: ''
    },
    pollutionCertificate: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: {
        values: ['Available', 'On Trip', 'In Shop', 'Retired'],
        message: 'Status must be Available, On Trip, In Shop, or Retired'
      },
      default: 'Available'
    },
    region: {
      type: String,
      required: [true, 'Region is required'],
      trim: true
    },
    notes: {
      type: String,
      trim: true
    },
    documents: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
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
    },
    // Audit Fields
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Index soft-delete to speed up query filtering
VehicleSchema.index({ isDeleted: 1 });

module.exports = mongoose.model('Vehicle', VehicleSchema);
