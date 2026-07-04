import { Router } from 'express';
import { updateProfile } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.put('/profile', updateProfile);

export default router;
