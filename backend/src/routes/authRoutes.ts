import { Router } from 'express';
import {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Public auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

export default router;
