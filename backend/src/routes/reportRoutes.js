const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateUser } = require('../middlewares/authMiddleware');

router.use(authenticateUser);

router.get('/fleet', reportController.getFleetReport);
router.get('/drivers', reportController.getDriverReport);
router.get('/trips', reportController.getTripReport);
router.get('/fuel', reportController.getFuelReport);
router.get('/maintenance', reportController.getMaintenanceReport);
router.get('/expenses', reportController.getExpenseReport);
router.get('/profitability', reportController.getProfitabilityReport);

module.exports = router;
