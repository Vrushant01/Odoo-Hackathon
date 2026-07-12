const { body, param } = require('express-validator');

const expenseIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Expense ID format')
];

const createExpenseValidator = [
  body('vehicle')
    .isMongoId()
    .withMessage('A valid vehicle ID is required'),
  body('trip')
    .optional()
    .isMongoId()
    .withMessage('Invalid trip ID format'),
  body('expenseType')
    .notEmpty()
    .withMessage('Expense type is required')
    .isIn([
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
    ])
    .withMessage('Invalid expense type category'),
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ gt: 0 })
    .withMessage('Amount must be greater than zero'),
  body('paymentStatus')
    .optional()
    .isIn(['Paid', 'Pending'])
    .withMessage('Payment status must be Paid or Pending'),
  body('expenseDate')
    .optional()
    .isISO8601()
    .withMessage('Expense date must be a valid date')
];

const updateExpenseValidator = [
  ...expenseIdValidator,
  body('amount')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Amount must be greater than zero'),
  body('paymentStatus')
    .optional()
    .isIn(['Paid', 'Pending'])
    .withMessage('Payment status must be Paid or Pending')
];

module.exports = {
  expenseIdValidator,
  createExpenseValidator,
  updateExpenseValidator
};
