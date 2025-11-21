import { Request, Response } from 'express';

import { fetchPlaceDetails } from '../services/googleService';
import {
  analyzeSentiment,
} from '../services/aiService';

/**
 * Fetch reviews from Google Places API
 */
export const fetchReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const placeId = req.query.place
    const dateRange =  req.query.dateRange || 'all';

    if (!placeId) {
      res.status(400).json({ error: 'placeId is required' });
      return;
    }

    // Fetch place details and reviews
    const placeData = await fetchPlaceDetails(<string>placeId);
    const analysedReviewData = await analyzeSentiment(placeData);


    res.json({
      success: true,
      placeData: analysedReviewData,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews', details: error instanceof Error ? error.message : 'Unknown error' });
  }
};

