const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const { authenticateUser, authorizeRoles } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const validateRequest = require('../middlewares/validationMiddleware');
const {
  maintenanceIdValidator,
  createMaintenanceValidator,
  updateMaintenanceValidator,
  completeMaintenanceValidator
} = require('../validators/maintenanceValidator');

// Apply authentication globally
router.use(authenticateUser);

// Multer upload config
const uploadFields = upload.fields([
  { name: 'attachments', maxCount: 3 }
]);

// 1. Stats and Lists (Mounted first to avoid matching :id)
router.get('/statistics', maintenanceController.getStatistics);
router.get('/upcoming', maintenanceController.getUpcoming);
router.get('/overdue', maintenanceController.getOverdue);

// 2. Read endpoints (Accessible by all roles)
router.get('/', maintenanceController.getMaintenanceList);
router.get('/:id', maintenanceIdValidator, validateRequest, maintenanceController.getMaintenanceDetails);

// 3. Write endpoints (Restricted to Fleet Manager)
router.use(authorizeRoles('Fleet Manager'));

router.post('/', uploadFields, createMaintenanceValidator, validateRequest, maintenanceController.createMaintenance);
router.put('/:id', uploadFields, updateMaintenanceValidator, validateRequest, maintenanceController.updateMaintenance);
router.patch('/:id/start', maintenanceIdValidator, validateRequest, maintenanceController.startMaintenance);
router.patch('/:id/complete', completeMaintenanceValidator, validateRequest, maintenanceController.completeMaintenance);
router.patch('/:id/cancel', maintenanceIdValidator, validateRequest, maintenanceController.cancelMaintenance);
router.delete('/:id', maintenanceIdValidator, validateRequest, maintenanceController.deleteMaintenance);

module.exports = router;
