import { Request, Response } from 'express';
import { Place } from '../models/Place';
import { Review } from '../models/Review';
import { Insight } from '../models/Insight';
import { fetchPlaceDetails, filterReviewsByDateRange, GoogleReview } from '../services/googleService';
import {
  chunkReviews,
  generateSummary,
  extractTopics,
  analyzeSentiment,
  mergeInsights,
  extractPositiveHighlights,
  extractNegativeHighlights,
} from '../services/aiService';

/**
 * Fetch reviews from Google Places API
 */
export const fetchReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { placeId, dateRange = 'all' } = req.body;

    if (!placeId) {
      res.status(400).json({ error: 'placeId is required' });
      return;
    }

    // Fetch place details and reviews
    const placeData = await fetchPlaceDetails(placeId);

    // Filter reviews by date range
    const filteredReviews = filterReviewsByDateRange(placeData.reviews || [], dateRange as any);

    // Save or update place info
    await Place.findOneAndUpdate(
      { placeId },
      {
        placeId,
        name: placeData.name,
        address: placeData.formatted_address,
        types: placeData.types,
        rating: placeData.rating,
        totalReviews: placeData.user_ratings_total,
        metadata: placeData,
      },
      { upsert: true, new: true }
    );

    // Convert Google reviews to our Review format
    const reviews = filteredReviews.map((review: GoogleReview) => ({
      placeId,
      author: review.author_name,
      rating: review.rating,
      text: review.text,
      time: new Date(review.time * 1000),
    }));

    res.json({
      success: true,
      place: {
        placeId,
        name: placeData.name,
        address: placeData.formatted_address,
      },
      reviews,
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews', details: error instanceof Error ? error.message : 'Unknown error' });
  }
};

/**
 * Process reviews with AI analysis
 */
export const processReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { placeId, reviews: reviewsData } = req.body;

    if (!placeId) {
      res.status(400).json({ error: 'placeId is required' });
      return;
    }

    if (!reviewsData || !Array.isArray(reviewsData) || reviewsData.length === 0) {
      res.status(400).json({ error: 'reviews array is required and must not be empty' });
      return;
    }

    // Save reviews to database
    const savedReviews = await Promise.all(
      reviewsData.map(async (review: any) => {
        return Review.findOneAndUpdate(
          {
            placeId,
            author: review.author,
            time: new Date(review.time),
          },
          {
            placeId,
            author: review.author,
            rating: review.rating,
            text: review.text,
            time: new Date(review.time),
          },
          { upsert: true, new: true }
        );
      })
    );

    // Convert to IReview format for AI processing
    const reviewsForAI = savedReviews.map((r) => ({
      _id: r._id,
      placeId: r.placeId,
      author: r.author,
      rating: r.rating,
      text: r.text,
      time: r.time,
    })) as any[];

    // Chunk reviews for processing
    const chunks = chunkReviews(reviewsForAI);

    console.log(`📊 Processing ${reviewsForAI.length} reviews in ${chunks.length} chunks...`);

    // Process each chunk in parallel
    const chunkResults = await Promise.all(
      chunks.map(async (chunk) => {
        const [summary, topics, sentiment] = await Promise.all([
          generateSummary(chunk),
          extractTopics(chunk),
          analyzeSentiment(chunk),
        ]);
        return { summary, topics, sentiment };
      })
    );

    // Extract summaries, topics, and sentiments
    const allSummaries = chunkResults.map((r) => r.summary);
    const allTopics = chunkResults.map((r) => r.topics);
    const allSentiments = chunkResults.map((r) => r.sentiment);

    // Merge insights
    const mergedInsights = await mergeInsights(chunks, allSummaries, allTopics, allSentiments);

    // Extract positive and negative highlights
    const [positiveHighlights, negativeHighlights] = await Promise.all([
      extractPositiveHighlights(reviewsForAI),
      extractNegativeHighlights(reviewsForAI),
    ]);

    // Calculate trends for different time periods
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    const calculateTrend = async (startDate: Date, period: string) => {
      const periodReviews = reviewsForAI.filter((r) => new Date(r.time) >= startDate);
      if (periodReviews.length === 0) return null;

      const avgRating = periodReviews.reduce((sum, r) => sum + r.rating, 0) / periodReviews.length;
      const sentiment = await analyzeSentiment(periodReviews);

      return {
        period,
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews: periodReviews.length,
        sentimentBreakdown: sentiment,
      };
    };

    const [weekTrend, monthTrend, yearTrend, allTrend] = await Promise.all([
      calculateTrend(weekAgo, 'week'),
      calculateTrend(monthAgo, 'month'),
      calculateTrend(yearAgo, 'year'),
      calculateTrend(new Date(0), 'all'),
    ]);

    // Create insight document
    const insightData = {
      placeId,
      summary: mergedInsights.summary,
      positiveHighlights,
      negativeHighlights,
      sentimentBreakdown: mergedInsights.sentimentBreakdown,
      topics: mergedInsights.topics,
      trends: {
        ...(weekTrend && { week: weekTrend }),
        ...(monthTrend && { month: monthTrend }),
        ...(yearTrend && { year: yearTrend }),
        ...(allTrend && { all: allTrend }),
      },
      lastProcessed: new Date(),
    };

    // Save or update insight
    const insight = await Insight.findOneAndUpdate({ placeId }, insightData, {
      upsert: true,
      new: true,
    });

    console.log('✅ Reviews processed successfully');

    res.json({
      success: true,
      insight,
    });
  } catch (error) {
    console.error('Error processing reviews:', error);
    res.status(500).json({
      error: 'Failed to process reviews',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Get insights for a place
 */
export const getInsights = async (req: Request, res: Response): Promise<void> => {
  try {
    const { placeId } = req.params;

    if (!placeId) {
      res.status(400).json({ error: 'placeId is required' });
      return;
    }

    const insight = await Insight.findOne({ placeId });

    if (!insight) {
      res.status(404).json({ error: 'Insights not found for this place. Please process reviews first.' });
      return;
    }

    // Also get place info
    const place = await Place.findOne({ placeId });

    res.json({
      success: true,
      insight,
      place: place || null,
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    res.status(500).json({
      error: 'Failed to fetch insights',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

