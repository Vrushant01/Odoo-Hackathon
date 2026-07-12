const { body, param } = require('express-validator');

// Validate trip ObjectId parameters
const tripIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Trip ID format')
];

// Validate trip creation requests
const createTripValidator = [
  body('vehicle')
    .isMongoId()
    .withMessage('A valid vehicle ID is required'),
  body('driver')
    .isMongoId()
    .withMessage('A valid driver ID is required'),
  body('source')
    .trim()
    .notEmpty()
    .withMessage('Source location is required'),
  body('destination')
    .trim()
    .notEmpty()
    .withMessage('Destination location is required'),
  body('cargoWeight')
    .notEmpty()
    .withMessage('Cargo weight is required')
    .isFloat({ gt: 0 })
    .withMessage('Cargo weight must be greater than zero'),
  body('plannedDistance')
    .notEmpty()
    .withMessage('Planned distance is required')
    .isFloat({ gt: 0 })
    .withMessage('Planned distance must be greater than zero'),
  body('priority')
    .notEmpty()
    .withMessage('Priority is required')
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Priority must be Low, Medium, High, or Critical'),
  body('dispatchDate')
    .notEmpty()
    .withMessage('Dispatch date is required')
    .isISO8601()
    .withMessage('Dispatch date must be a valid date')
];

// Validate trip update requests
const updateTripValidator = [
  ...tripIdValidator,
  body('vehicle')
    .optional()
    .isMongoId()
    .withMessage('Invalid vehicle ID format'),
  body('driver')
    .optional()
    .isMongoId()
    .withMessage('Invalid driver ID format'),
  body('cargoWeight')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Cargo weight must be greater than zero'),
  body('plannedDistance')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Planned distance must be greater than zero'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Priority must be Low, Medium, High, or Critical')
];

// Validate trip completion requests
const completeTripValidator = [
  ...tripIdValidator,
  body('finalOdometer')
    .notEmpty()
    .withMessage('Final odometer reading is required')
    .isFloat({ min: 0 })
    .withMessage('Final odometer reading cannot be negative'),
  body('fuelConsumed')
    .notEmpty()
    .withMessage('Fuel consumed is required')
    .isFloat({ min: 0 })
    .withMessage('Fuel consumed cannot be negative'),
  body('actualDistance')
    .notEmpty()
    .withMessage('Actual distance covered is required')
    .isFloat({ min: 0 })
    .withMessage('Actual distance cannot be negative'),
  body('completionDate')
    .optional()
    .isISO8601()
    .withMessage('Completion date must be a valid date'),
  body('fuelCost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Fuel cost cannot be negative'),
  body('maintenanceCost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maintenance cost cannot be negative'),
  body('tollCost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Toll cost cannot be negative'),
  body('otherExpenses')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Other expenses cannot be negative')
];

// Validate trip cancellation requests
const cancelTripValidator = [
  ...tripIdValidator,
  body('reason')
    .trim()
    .notEmpty()
    .withMessage('Cancellation reason is required')
];

module.exports = {
  tripIdValidator,
  createTripValidator,
  updateTripValidator,
  completeTripValidator,
  cancelTripValidator
};
