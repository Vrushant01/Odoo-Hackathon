const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { authenticateUser, authorizeRoles } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const validateRequest = require('../middlewares/validationMiddleware');
const {
  vehicleIdValidator,
  createVehicleValidator,
  updateVehicleValidator
} = require('../validators/vehicleValidator');

// Apply authentication middleware globally on vehicle routes
router.use(authenticateUser);

// Multer upload field specifications for vehicle documents
const uploadFields = upload.fields([
  { name: 'registrationCertificate', maxCount: 1 },
  { name: 'fitnessCertificate', maxCount: 1 },
  { name: 'pollutionCertificate', maxCount: 1 }
]);

// 1. Aggregate Statistics (Mounted first to avoid matching :id)
router.get('/statistics', vehicleController.getVehicleStatistics);

// 2. Read endpoints (Accessible by any authenticated user)
router.get('/', vehicleController.getVehicles);
router.get('/:id', vehicleIdValidator, validateRequest, vehicleController.getVehicleDetails);
router.get('/:id/history', vehicleIdValidator, validateRequest, vehicleController.getVehicleHistory);

// 3. Write/Modify endpoints (Restricted strictly to Fleet Manager)
router.use(authorizeRoles('Fleet Manager'));

router.post(
  '/', 
  uploadFields, 
  createVehicleValidator, 
  validateRequest, 
  vehicleController.registerVehicle
);
router.put(
  '/:id', 
  uploadFields, 
  updateVehicleValidator, 
  validateRequest, 
  vehicleController.updateVehicle
);
router.patch('/:id/retire', vehicleIdValidator, validateRequest, vehicleController.retireVehicle);
router.delete('/:id', vehicleIdValidator, validateRequest, vehicleController.deleteVehicle);

module.exports = router;
