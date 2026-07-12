const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema(
  {
    maintenanceNumber: {
      type: String,
      required: [true, 'Maintenance number is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle is required']
    },
    maintenanceType: {
      type: String,
      required: [true, 'Maintenance type is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    priority: {
      type: String,
      required: [true, 'Priority is required'],
      enum: {
        values: ['Low', 'Medium', 'High', 'Critical'],
        message: 'Priority must be Low, Medium, High, or Critical'
      },
      default: 'Medium'
    },
    status: {
      type: String,
      enum: {
        values: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
        message: 'Status must be Scheduled, In Progress, Completed, or Cancelled'
      },
      default: 'Scheduled'
    },
    workshop: {
      type: String,
      trim: true
    },
    mechanic: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    scheduledDate: {
      type: Date,
      required: [true, 'Scheduled date is required']
    },
    startedDate: {
      type: Date
    },
    estimatedCompletion: {
      type: Date
    },
    completedDate: {
      type: Date
    },
    estimatedCost: {
      type: Number,
      default: 0,
      min: [0, 'Estimated cost cannot be negative']
    },
    labourCost: {
      type: Number,
      default: 0,
      min: [0, 'Labour cost cannot be negative']
    },
    partsCost: {
      type: Number,
      default: 0,
      min: [0, 'Parts cost cannot be negative']
    },
    additionalCost: {
      type: Number,
      default: 0,
      min: [0, 'Additional cost cannot be negative']
    },
    finalCost: {
      type: Number,
      default: 0,
      min: [0, 'Final cost cannot be negative']
    },
    partsUsed: [
      {
        type: String,
        trim: true
      }
    ],
    serviceNotes: {
      type: String,
      trim: true
    },
    attachments: [
      {
        type: String,
        trim: true
      }
    ],
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
MaintenanceSchema.index({ vehicle: 1 });
MaintenanceSchema.index({ status: 1 });
MaintenanceSchema.index({ isDeleted: 1 });

module.exports = mongoose.model('Maintenance', MaintenanceSchema);
