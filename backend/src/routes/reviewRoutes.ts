import { Router } from 'express';
import {
  fetchReviews,
  processReviews,
  getInsights,
} from '../controllers/reviewController';

const router = Router();

router.post('/fetch', fetchReviews);
router.post('/process', processReviews);
router.get('/insights/:placeId', getInsights);

export default router;

