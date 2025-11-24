import { Request, Response } from 'express';

import {fetchPlaceDetails, GoogleReview} from '../services/googleService';
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
    if (!placeData || placeData.reviews?.length === 0) {
        res.status(400).json({ error: 'reviews not found' });
        return; // Add return to prevent further execution
    }

    let oneWeekBack = new Date().getTime() - (7*24*60*60*1000);
    let oneMonthBack = new Date().getTime() - (30*24*60*60*1000);
    let oneYearBack = new Date().getTime() - (365*24*60*60*1000);

    let filteredReviews: GoogleReview[] | any = placeData.reviews
    if (dateRange != null && dateRange !== '' && dateRange !== 'all') {
        switch (dateRange) {
            case 'Week':
                filteredReviews = filteredReviews?.filter((i: { time: number; }) => i.time > oneWeekBack)
                break;
            case 'Month':
                filteredReviews = filteredReviews?.filter((i: { time: number; }) => i.time > oneMonthBack)
                break;
            case 'Year':
                filteredReviews = filteredReviews?.filter((i: { time: number; }) => i.time > oneYearBack)
                break;
        }
    }

    let analysedReviewData = await analyzeSentiment(placeData);

    res.json({
      success: true,
      placeData: analysedReviewData,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Error details:', { message: errorMessage, stack: errorStack });
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch reviews', 
      details: errorMessage,
      message: errorMessage
    });
  }
};

