import { Router } from 'express';
import {
  getTrainerClasses,
  getClassBookings,
  updateAttendance,
  getTrainersPublic
} from '../controllers/trainerController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', getTrainersPublic);

// Protected routes (require auth)
router.use(protect);

router.get('/classes', restrictTo('trainer', 'admin', 'super-admin'), getTrainerClasses);
router.get('/classes/:id/bookings', restrictTo('trainer', 'admin', 'super-admin'), getClassBookings);
router.put('/bookings/:id/attendance', restrictTo('trainer', 'admin', 'super-admin'), updateAttendance);

export default router;
