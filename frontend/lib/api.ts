import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Review {
  placeId: string;
  author: string;
  rating: number;
  text: string;
  time: string;
}

export interface FetchReviewsResponse {
  success: boolean;
  place: {
    placeId: string;
    name: string;
    address?: string;
  };
  reviews: Review[];
  totalReviews: number;
}

export interface TrendData {
  period: string;
  averageRating: number;
  totalReviews: number;
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export interface Insight {
  placeId: string;
  summary: string;
  positiveHighlights: string[];
  negativeHighlights: string[];
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
  topics: Array<{
    name: string;
    count: number;
    sentiment: 'positive' | 'negative' | 'neutral';
  }>;
  trends: {
    week?: TrendData;
    month?: TrendData;
    year?: TrendData;
    all?: TrendData;
  };
  lastProcessed: string;
}

export interface ProcessReviewsResponse {
  success: boolean;
  insight: Insight;
}

export interface Place {
  placeId: string;
  name: string;
  address?: string;
  types?: string[];
  rating?: number;
  totalReviews?: number;
}

export interface GetInsightsResponse {
  success: boolean;
  insight: Insight;
  place: Place | null;
}

export const reviewAPI = {
  fetchReviews: async (placeId: string, dateRange: 'week' | 'month' | 'year' | 'all' = 'all'): Promise<FetchReviewsResponse> => {
    const response = await api.post<FetchReviewsResponse>('/reviews/fetch', {
      placeId,
      dateRange,
    });
    return response.data;
  },

  processReviews: async (placeId: string, reviews: Review[]): Promise<ProcessReviewsResponse> => {
    const response = await api.post<ProcessReviewsResponse>('/reviews/process', {
      placeId,
      reviews,
    });
    return response.data;
  },

  getInsights: async (placeId: string): Promise<GetInsightsResponse> => {
    const response = await api.get<GetInsightsResponse>(`/reviews/insights/${placeId}`);
    return response.data;
  },
};

