import { Router } from 'express';
import {
  fetchReviews,
} from '../controllers/reviewController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/fetch', authenticate, fetchReviews);

export default router;

