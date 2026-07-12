const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const { authenticateUser, authorizeRoles } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const validateRequest = require('../middlewares/validationMiddleware');
const {
  driverIdValidator,
  createDriverValidator,
  updateDriverValidator,
  suspendDriverValidator
} = require('../validators/driverValidator');

// Apply authentication middleware globally on driver routes
router.use(authenticateUser);

// Multer upload specifications for driver documents and photos
const uploadFields = upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'licenseDocument', maxCount: 1 },
  { name: 'governmentId', maxCount: 1 },
  { name: 'medicalCertificate', maxCount: 1 },
  { name: 'policeVerification', maxCount: 1 }
]);

// 1. Statistics (Mounted BEFORE ID matching routes)
router.get('/statistics', driverController.getDriverStatistics);

// 2. Read endpoints (Accessible by all authenticated roles)
router.get('/', driverController.getDrivers);
router.get('/:id', driverIdValidator, validateRequest, driverController.getDriverDetails);
router.get('/:id/history', driverIdValidator, validateRequest, driverController.getDriverHistory);
router.get('/:id/performance', driverIdValidator, validateRequest, driverController.getDriverPerformance);

// 3. Write endpoints (Restricted to Fleet Manager)
router.use(authorizeRoles('Fleet Manager'));

router.post(
  '/', 
  uploadFields, 
  createDriverValidator, 
  validateRequest, 
  driverController.registerDriver
);
router.put(
  '/:id', 
  uploadFields, 
  updateDriverValidator, 
  validateRequest, 
  driverController.updateDriver
);
router.patch('/:id/suspend', suspendDriverValidator, validateRequest, driverController.suspendDriver);
router.patch('/:id/activate', driverIdValidator, validateRequest, driverController.activateDriver);
router.delete('/:id', driverIdValidator, validateRequest, driverController.deleteDriver);

module.exports = router;
