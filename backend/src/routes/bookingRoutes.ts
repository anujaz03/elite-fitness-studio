import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  rescheduleBooking
} from '../controllers/bookingController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

// All booking routes require authentication
router.use(protect);

router.post('/', restrictTo('member'), createBooking);
router.get('/my-bookings', getMyBookings);
router.put('/:id/cancel', cancelBooking);
router.put('/:id/reschedule', restrictTo('member'), rescheduleBooking);

export default router;
