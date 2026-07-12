const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
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
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false // Hide password from database queries by default
    },
    phoneNumber: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: {
        values: ['Super Admin', 'Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'],
        message: 'Role must be Super Admin, Fleet Manager, Dispatcher, Safety Officer, or Financial Analyst'
      }
    },
    profileImage: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Suspended'],
      default: 'Active'
    },
    lastLogin: {
      type: Date
    },
    failed_attempts: {
      type: Number,
      default: 0
    },
    account_locked: {
      type: Boolean,
      default: false
    },
    locked_at: {
      type: Date,
      default: null
    },
    locked_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    unlock_reason: {
      type: String,
      default: null
    },
    last_failed_login: {
      type: Date,
      default: null
    },
    last_successful_login: {
      type: Date,
      default: null
    },
    department: {
      type: String,
      trim: true,
      default: 'Operations'
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  // Prevent double-hashing if password is already a bcrypt hash
  if (this.password && /^\$2[ayb]\$\d+\$[./A-Za-z0-9]{53}$/.test(this.password)) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed database password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
