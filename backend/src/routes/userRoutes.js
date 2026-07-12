const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateUser, authorizeRoles } = require('../middlewares/authMiddleware');

router.use(authenticateUser);
// Restrict to admin users (Super Admin only)
router.use(authorizeRoles('Super Admin'));

router.get('/', userController.getUsers);
router.get('/stats', userController.getStats);
router.get('/audit-logs', userController.getAuditLogsList);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.patch('/:id/status', userController.toggleStatus);
router.patch('/:id/lock', userController.lockUser);
router.patch('/:id/unlock', userController.unlockUser);
router.patch('/:id/reset-attempts', userController.resetAttempts);
router.post('/:id/reset-password', userController.resetPassword);

module.exports = router;
