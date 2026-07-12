const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const validateRequest = require('../middlewares/validationMiddleware');
const {
  loginValidator,
  changePasswordValidator,
  updateProfileValidator
} = require('../validators/authValidator');

// Public auth endpoints
router.post('/login', loginValidator, validateRequest, authController.login);
router.post('/logout', authController.logout);

// Secure auth endpoints (requires authenticating the token)
router.use(authenticateUser);

router.get('/me', authController.getMe);
router.put(
  '/profile', 
  upload.single('profileImage'), 
  updateProfileValidator, 
  validateRequest, 
  authController.updateProfile
);
router.put(
  '/change-password', 
  changePasswordValidator, 
  validateRequest, 
  authController.changePassword
);

module.exports = router;
