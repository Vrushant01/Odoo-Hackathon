const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { authenticateUser, authorizeRoles } = require('../middlewares/authMiddleware');

router.use(authenticateUser);

router.get('/', settingsController.getSettings);
router.put('/', authorizeRoles('Fleet Manager'), settingsController.updateSettings);

module.exports = router;
