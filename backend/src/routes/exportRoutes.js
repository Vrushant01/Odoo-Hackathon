const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const { authenticateUser } = require('../middlewares/authMiddleware');

router.use(authenticateUser);

// CSV downloads
router.get('/csv/vehicles', exportController.exportVehiclesCsv);
router.get('/csv/drivers', exportController.exportDriversCsv);
router.get('/csv/trips', exportController.exportTripsCsv);
router.get('/csv/fuel', exportController.exportFuelCsv);
router.get('/csv/expenses', exportController.exportExpensesCsv);
router.get('/csv/maintenance', exportController.exportMaintenanceCsv);

// PDF downloads
router.get('/pdf/dashboard', exportController.exportDashboardPdf);
router.get('/pdf/report', exportController.exportReportPdf);
router.get('/pdf/trip/:id', exportController.exportTripPdf);
router.get('/pdf/vehicle/:id', exportController.exportVehiclePdf);

module.exports = router;
