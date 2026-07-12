const mongoose = require('mongoose');

const FuelLogSchema = new mongoose.Schema(
  {
    fuelLogNumber: {
      type: String,
      required: [true, 'Fuel log number is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle is required']
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver'
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip'
    },
    fuelType: {
      type: String,
      trim: true
    },
    fuelStation: {
      type: String,
      trim: true
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity in liters is required'],
      min: [0.01, 'Quantity must be greater than zero']
    },
    pricePerUnit: {
      type: Number,
      required: [true, 'Price per unit is required'],
      min: [0.01, 'Price per unit must be greater than zero']
    },
    totalCost: {
      type: Number,
      required: true,
      default: 0
    },
    currentOdometer: {
      type: Number,
      min: [0, 'Current odometer reading cannot be negative']
    },
    invoiceNumber: {
      type: String,
      trim: true
    },
    paymentMethod: {
      type: String,
      trim: true
    },
    fuelDate: {
      type: Date,
      required: [true, 'Fuel purchase date is required'],
      default: Date.now
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
FuelLogSchema.index({ vehicle: 1 });
FuelLogSchema.index({ trip: 1 });
FuelLogSchema.index({ isDeleted: 1 });

module.exports = mongoose.model('FuelLog', FuelLogSchema);
