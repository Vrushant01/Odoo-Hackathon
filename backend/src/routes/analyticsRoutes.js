const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateUser } = require('../middlewares/authMiddleware');

router.use(authenticateUser);

router.get('/fleet', analyticsController.getFleetAnalytics);
router.get('/drivers', analyticsController.getDriverAnalytics);
router.get('/trips', analyticsController.getTripAnalytics);
router.get('/fuel', analyticsController.getFuelAnalytics);
router.get('/expenses', analyticsController.getExpenseAnalytics);

module.exports = router;
