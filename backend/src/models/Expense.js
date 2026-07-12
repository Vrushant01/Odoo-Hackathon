const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema(
  {
    expenseNumber: {
      type: String,
      required: [true, 'Expense number is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle is required']
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip'
    },
    expenseType: {
      type: String,
      required: [true, 'Expense type is required'],
      enum: {
        values: [
          'Fuel',
          'Maintenance',
          'Repair',
          'Insurance',
          'Parking',
          'Toll',
          'Permit',
          'Cleaning',
          'Battery',
          'Tyre',
          'Fine',
          'Other'
        ],
        message: 'Expense type must be one of the pre-defined categories'
      }
    },
    vendor: {
      type: String,
      trim: true
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Expense amount must be greater than zero']
    },
    paymentMethod: {
      type: String,
      trim: true
    },
    invoiceNumber: {
      type: String,
      trim: true
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['Paid', 'Pending'],
        message: 'Payment status must be Paid or Pending'
      },
      default: 'Paid'
    },
    expenseDate: {
      type: Date,
      required: [true, 'Expense date is required'],
      default: Date.now
    },
    remarks: {
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
ExpenseSchema.index({ vehicle: 1 });
ExpenseSchema.index({ trip: 1 });
ExpenseSchema.index({ isDeleted: 1 });

module.exports = mongoose.model('Expense', ExpenseSchema);
