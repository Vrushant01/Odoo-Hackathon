const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { authenticateUser, authorizeRoles } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validationMiddleware');
const {
  tripIdValidator,
  createTripValidator,
  updateTripValidator,
  completeTripValidator,
  cancelTripValidator
} = require('../validators/tripValidator');

// Apply authentication middleware globally on trip routes
router.use(authenticateUser);

// 1. Statistics (Mounted BEFORE ID matching routes)
router.get('/statistics', tripController.getTripStatistics);

// 2. Read endpoints (Accessible by all authenticated roles)
router.get('/', tripController.getTrips);
router.get('/:id', tripIdValidator, validateRequest, tripController.getTripDetails);
router.get('/:id/timeline', tripIdValidator, validateRequest, tripController.getTripTimeline);

// 3. Write endpoints (Restricted strictly to Fleet Manager)
router.use(authorizeRoles('Fleet Manager'));

router.post('/', createTripValidator, validateRequest, tripController.createTrip);
router.put('/:id', updateTripValidator, validateRequest, tripController.updateTrip);
router.patch('/:id/dispatch', tripIdValidator, validateRequest, tripController.dispatchTrip);
router.patch('/:id/complete', completeTripValidator, validateRequest, tripController.completeTrip);
router.patch('/:id/cancel', cancelTripValidator, validateRequest, tripController.cancelTrip);
router.delete('/:id', tripIdValidator, validateRequest, tripController.deleteTrip);

module.exports = router;
