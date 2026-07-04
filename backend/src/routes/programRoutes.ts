import { Router } from 'express';
import { getPrograms, getProgramById } from '../controllers/programController';

const router = Router();

router.get('/', getPrograms);
router.get('/:id', getProgramById);

export default router;
