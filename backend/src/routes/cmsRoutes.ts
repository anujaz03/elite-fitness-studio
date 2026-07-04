import { Router } from 'express';
import {
  getTestimonials,
  getBlogs,
  submitContact,
  createBlog
} from '../controllers/cmsController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

router.get('/testimonials', getTestimonials);
router.get('/blogs', getBlogs);
router.post('/contact', submitContact);
router.post('/blogs', protect, restrictTo('admin', 'super-admin'), createBlog);

export default router;
