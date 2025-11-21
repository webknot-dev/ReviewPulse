import { Router } from 'express';
import {
  fetchReviews,
} from '../controllers/reviewController';

const router = Router();

router.get('/fetch', fetchReviews);
// router.post('/process', processReviews);
// router.get('/insights/:placeId', getInsights);

export default router;

