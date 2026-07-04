import { Router } from 'express';
import {
  createOrder,
  verifyPayment,
  getPaymentHistory,
  getInvoice
} from '../controllers/paymentController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

// All payment routes require authentication
router.use(protect);

router.post('/create-order', restrictTo('member'), createOrder);
router.post('/verify', restrictTo('member'), verifyPayment);
router.get('/history', getPaymentHistory);
router.get('/invoice/:id', getInvoice);

export default router;
