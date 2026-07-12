const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema(
  {
    tripNumber: {
      type: String,
      required: [true, 'Trip number is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    source: {
      type: String,
      required: [true, 'Source location is required'],
      trim: true
    },
    destination: {
      type: String,
      required: [true, 'Destination location is required'],
      trim: true
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle is required']
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: [true, 'Driver is required']
    },
    cargoDescription: {
      type: String,
      trim: true
    },
    cargoWeight: {
      type: Number,
      required: [true, 'Cargo weight is required'],
      min: [0, 'Cargo weight cannot be negative']
    },
    maximumVehicleCapacity: {
      type: Number
    },
    plannedDistance: {
      type: Number,
      required: [true, 'Planned distance is required'],
      min: [0, 'Planned distance cannot be negative']
    },
    actualDistance: {
      type: Number,
      default: 0,
      min: [0, 'Actual distance cannot be negative']
    },
    estimatedDuration: {
      type: Number,
      default: 0,
      min: [0, 'Estimated duration cannot be negative']
    },
    actualDuration: {
      type: Number,
      default: 0,
      min: [0, 'Actual duration cannot be negative']
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High', 'Critical'],
        message: 'Priority must be Low, Medium, High, or Critical'
      },
      default: 'Medium'
    },
    status: {
      type: String,
      enum: {
        values: ['Draft', 'Dispatched', 'Completed', 'Cancelled'],
        message: 'Status must be Draft, Dispatched, Completed, or Cancelled'
      },
      default: 'Draft'
    },
    dispatchDate: {
      type: Date
    },
    expectedCompletionDate: {
      type: Date
    },
    completedDate: {
      type: Date
    },
    fuelConsumed: {
      type: Number,
      default: 0,
      min: [0, 'Fuel consumed cannot be negative']
    },
    fuelCost: {
      type: Number,
      default: 0,
      min: [0, 'Fuel cost cannot be negative']
    },
    maintenanceCost: {
      type: Number,
      default: 0,
      min: [0, 'Maintenance cost cannot be negative']
    },
    tollCost: {
      type: Number,
      default: 0,
      min: [0, 'Toll cost cannot be negative']
    },
    otherExpenses: {
      type: Number,
      default: 0,
      min: [0, 'Other operational expenses cannot be negative']
    },
    totalOperationalCost: {
      type: Number,
      default: 0,
      min: [0, 'Total operational cost cannot be negative']
    },
    notes: {
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
TripSchema.index({ isDeleted: 1 });
TripSchema.index({ status: 1 });

module.exports = mongoose.model('Trip', TripSchema);
