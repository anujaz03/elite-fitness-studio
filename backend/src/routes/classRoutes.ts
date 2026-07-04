import { Router } from 'express';
import { getClassesSchedule } from '../controllers/classController';

const router = Router();

router.get('/schedule', getClassesSchedule);

export default router;
