const { body, param } = require('express-validator');

const maintenanceIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Maintenance ID format')
];

const createMaintenanceValidator = [
  body('vehicle')
    .isMongoId()
    .withMessage('A valid vehicle ID is required'),
  body('maintenanceType')
    .trim()
    .notEmpty()
    .withMessage('Maintenance type is required'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  body('priority')
    .notEmpty()
    .withMessage('Priority is required')
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Priority must be Low, Medium, High, or Critical'),
  body('scheduledDate')
    .notEmpty()
    .withMessage('Scheduled date is required')
    .isISO8601()
    .withMessage('Scheduled date must be a valid date'),
  body('estimatedCost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Estimated cost cannot be negative')
];

const updateMaintenanceValidator = [
  ...maintenanceIdValidator,
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Priority must be Low, Medium, High, or Critical'),
  body('estimatedCost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Estimated cost cannot be negative')
];

const completeMaintenanceValidator = [
  ...maintenanceIdValidator,
  body('labourCost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Labour cost cannot be negative'),
  body('partsCost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Parts cost cannot be negative'),
  body('additionalCost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Additional cost cannot be negative')
];

module.exports = {
  maintenanceIdValidator,
  createMaintenanceValidator,
  updateMaintenanceValidator,
  completeMaintenanceValidator
};
