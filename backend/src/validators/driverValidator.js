const { body, param } = require('express-validator');

// Validate driver ObjectId parameters
const driverIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Driver ID format')
];

// Validate driver registration requests
const createDriverValidator = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required'),
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('licenseNumber')
    .trim()
    .notEmpty()
    .withMessage('License number is required')
    .toUpperCase(),
  body('licenseCategory')
    .notEmpty()
    .withMessage('License category is required')
    .isIn(['LMV', 'HMV', 'Transport', 'Commercial', 'Heavy Vehicle', 'Custom'])
    .withMessage('License category must be LMV, HMV, Transport, Commercial, Heavy Vehicle, or Custom'),
  body('licenseExpiryDate')
    .notEmpty()
    .withMessage('License expiry date is required')
    .isISO8601()
    .withMessage('License expiry date must be a valid date'),
  body('safetyScore')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Safety score must be between 0 and 100'),
  body('status')
    .optional()
    .isIn(['Available', 'On Trip', 'Off Duty', 'Suspended', 'License Expired'])
    .withMessage('Status must be Available, On Trip, Off Duty, Suspended, or License Expired')
];

// Validate driver update requests
const updateDriverValidator = [
  ...driverIdValidator,
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('licenseCategory')
    .optional()
    .isIn(['LMV', 'HMV', 'Transport', 'Commercial', 'Heavy Vehicle', 'Custom'])
    .withMessage('License category must be LMV, HMV, Transport, Commercial, Heavy Vehicle, or Custom'),
  body('licenseExpiryDate')
    .optional()
    .isISO8601()
    .withMessage('License expiry date must be a valid date'),
  body('safetyScore')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Safety score must be between 0 and 100')
];

// Validate driver suspension requests
const suspendDriverValidator = [
  ...driverIdValidator,
  body('reason')
    .trim()
    .notEmpty()
    .withMessage('Suspension reason is required'),
  body('suspendedDate')
    .optional()
    .isISO8601()
    .withMessage('Suspension date must be a valid date')
];

module.exports = {
  driverIdValidator,
  createDriverValidator,
  updateDriverValidator,
  suspendDriverValidator
};
