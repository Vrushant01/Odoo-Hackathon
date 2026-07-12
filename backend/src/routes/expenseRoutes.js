const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { authenticateUser, authorizeRoles } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const validateRequest = require('../middlewares/validationMiddleware');
const {
  expenseIdValidator,
  createExpenseValidator,
  updateExpenseValidator
} = require('../validators/expenseValidator');

// Apply authentication globally
router.use(authenticateUser);

// Multer upload config
const uploadFields = upload.fields([
  { name: 'attachments', maxCount: 3 }
]);

// 1. Stats & vehicle history logs (Mounted first)
router.get('/statistics', expenseController.getExpenseStatistics);
router.get('/vehicle/:vehicleId', expenseController.getExpensesByVehicle);

// 2. Read endpoints (Accessible by all roles)
router.get('/', expenseController.getExpenses);
router.get('/:id', expenseIdValidator, validateRequest, expenseController.getExpenseDetails);

// 3. Write endpoints (Restricted to Fleet Manager)
router.use(authorizeRoles('Fleet Manager'));

router.post('/', uploadFields, createExpenseValidator, validateRequest, expenseController.createExpense);
router.put('/:id', uploadFields, updateExpenseValidator, validateRequest, expenseController.updateExpense);
router.delete('/:id', expenseIdValidator, validateRequest, expenseController.deleteExpense);

module.exports = router;
