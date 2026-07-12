const { body, param } = require('express-validator');

const fuelLogIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Fuel log ID format')
];

const createFuelValidator = [
  body('vehicle')
    .isMongoId()
    .withMessage('A valid vehicle ID is required'),
  body('driver')
    .optional()
    .isMongoId()
    .withMessage('Invalid driver ID format'),
  body('trip')
    .optional()
    .isMongoId()
    .withMessage('Invalid trip ID format'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isFloat({ gt: 0 })
    .withMessage('Quantity must be greater than zero'),
  body('pricePerUnit')
    .notEmpty()
    .withMessage('Price per unit is required')
    .isFloat({ gt: 0 })
    .withMessage('Price per unit must be greater than zero'),
  body('currentOdometer')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Odometer reading cannot be negative'),
  body('fuelDate')
    .optional()
    .isISO8601()
    .withMessage('Fuel date must be a valid date')
];

const updateFuelValidator = [
  ...fuelLogIdValidator,
  body('quantity')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Quantity must be greater than zero'),
  body('pricePerUnit')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Price per unit must be greater than zero'),
  body('currentOdometer')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Odometer reading cannot be negative')
];

module.exports = {
  fuelLogIdValidator,
  createFuelValidator,
  updateFuelValidator
};
