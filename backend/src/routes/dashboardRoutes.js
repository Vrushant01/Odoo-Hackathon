const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateUser } = require('../middlewares/authMiddleware');

router.use(authenticateUser);

router.get('/', dashboardController.getDashboardSummary);
router.get('/summary', dashboardController.getDashboardSummary);
router.get('/charts', dashboardController.getDashboardCharts);
router.get('/recent-trips', dashboardController.getRecentActivities);
router.get('/maintenance', dashboardController.getDashboardMaintenance);
router.get('/notifications', dashboardController.getDashboardNotifications);

module.exports = router;
