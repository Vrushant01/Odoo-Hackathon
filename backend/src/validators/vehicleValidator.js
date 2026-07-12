const { body, param } = require('express-validator');

// Validate vehicle ObjectId parameters
const vehicleIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Vehicle ID format')
];

// Validate vehicle registration requests
const createVehicleValidator = [
  body('registrationNumber')
    .trim()
    .notEmpty()
    .withMessage('Registration number is required')
    .toUpperCase(),
  body('vehicleName')
    .trim()
    .notEmpty()
    .withMessage('Vehicle name is required'),
  body('vehicleModel')
    .trim()
    .notEmpty()
    .withMessage('Vehicle model is required'),
  body('vehicleType')
    .notEmpty()
    .withMessage('Vehicle type is required')
    .isIn(['Truck', 'Van', 'Sedan', 'SUV', 'Trailer'])
    .withMessage('Vehicle type must be Truck, Van, Sedan, SUV, or Trailer'),
  body('fuelType')
    .optional()
    .isIn(['Diesel', 'Petrol', 'Electric', 'CNG', 'Hybrid'])
    .withMessage('Fuel type must be Diesel, Petrol, Electric, CNG, or Hybrid'),
  body('maximumLoadCapacity')
    .notEmpty()
    .withMessage('Maximum load capacity is required')
    .isFloat({ gt: 0 })
    .withMessage('Maximum capacity must be greater than zero'),
  body('currentOdometer')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Current odometer reading cannot be negative'),
  body('acquisitionCost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Acquisition cost cannot be negative'),
  body('purchaseDate')
    .notEmpty()
    .withMessage('Purchase date is required')
    .isISO8601()
    .withMessage('Purchase date must be a valid date')
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error('Purchase date cannot be a future date');
      }
      return true;
    }),
  body('region')
    .trim()
    .notEmpty()
    .withMessage('Region is required'),
  body('status')
    .optional()
    .isIn(['Available', 'On Trip', 'In Shop', 'Retired'])
    .withMessage('Status must be Available, On Trip, In Shop, or Retired')
];

// Validate vehicle update requests
const updateVehicleValidator = [
  ...vehicleIdValidator,
  body('maximumLoadCapacity')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Maximum capacity must be greater than zero'),
  body('currentOdometer')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Current odometer reading cannot be negative'),
  body('purchaseDate')
    .optional()
    .isISO8601()
    .withMessage('Purchase date must be a valid date')
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error('Purchase date cannot be a future date');
      }
      return true;
    }),
  body('vehicleType')
    .optional()
    .isIn(['Truck', 'Van', 'Sedan', 'SUV', 'Trailer'])
    .withMessage('Vehicle type must be Truck, Van, Sedan, SUV, or Trailer'),
  body('fuelType')
    .optional()
    .isIn(['Diesel', 'Petrol', 'Electric', 'CNG', 'Hybrid'])
    .withMessage('Fuel type must be Diesel, Petrol, Electric, CNG, or Hybrid'),
  body('status')
    .optional()
    .isIn(['Available', 'On Trip', 'In Shop', 'Retired'])
    .withMessage('Status must be Available, On Trip, In Shop, or Retired')
];

module.exports = {
  vehicleIdValidator,
  createVehicleValidator,
  updateVehicleValidator
};
