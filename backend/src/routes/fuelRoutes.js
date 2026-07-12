const express = require('express');
const router = express.Router();
const fuelController = require('../controllers/fuelController');
const { authenticateUser, authorizeRoles } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validationMiddleware');
const {
  fuelLogIdValidator,
  createFuelValidator,
  updateFuelValidator
} = require('../validators/fuelValidator');

// Apply authentication globally
router.use(authenticateUser);

// 1. Statistics & vehicle history logs (Mounted first)
router.get('/statistics', fuelController.getFuelStatistics);
router.get('/vehicle/:vehicleId', fuelController.getFuelLogsByVehicle);

// 2. Read endpoints (Accessible by all roles)
router.get('/', fuelController.getFuelLogs);
router.get('/:id', fuelLogIdValidator, validateRequest, fuelController.getFuelDetails);

// 3. Write endpoints (Restricted to Fleet Manager)
router.use(authorizeRoles('Fleet Manager'));

router.post('/', createFuelValidator, validateRequest, fuelController.createFuelLog);
router.put('/:id', updateFuelValidator, validateRequest, fuelController.updateFuelLog);
router.delete('/:id', fuelLogIdValidator, validateRequest, fuelController.deleteFuelLog);

module.exports = router;
