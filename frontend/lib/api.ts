import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

console.log('🔧 API Configuration:', {
  API_URL,
  baseURL: `${API_URL}/api`,
  fullEndpoint: `${API_URL}/api/reviews/fetch`
});

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 second timeout (AI processing can take longer)
  withCredentials: true, // Include credentials for CORS
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Making request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      params: config.params,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error('❌ Response error:', {
      message: error.message,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      } : 'No response received'
    });
    return Promise.reject(error);
  }
);

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

// Backend response structure for /api/reviews/fetch
export interface AnalysedReview {
  text: string;
  mentions: number;
}

export interface PlaceDataResponse {
  success: boolean;
  placeData: {
    place_name: string;
    rating: number;
    pos_reviews: AnalysedReview[];
    neg_reviews: AnalysedReview[];
    overall_sentiment: string;
    highlights: string[];
    total_reviews: number;
    category: string;
    attributes_analyzed: Record<string, string>;
    possible_filters: string[];
  };
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
  // Test with native fetch
  testFetch: async (place: string): Promise<any> => {
    try {
      console.log('🧪 Testing with native fetch...');
      const url = `${API_URL}/api/reviews/fetch?place=${encodeURIComponent(place)}`;
      console.log('🧪 Fetch URL:', url);
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log('🧪 Fetch response:', {
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('🧪 Fetch data:', data);
        return data;
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timed out. The server is taking too long to respond. Please try again.');
        }
        throw fetchError;
      }
    } catch (error) {
      console.error('🧪 Fetch error:', error);
      throw error;
    }
  },

  fetchReviews: async (place: string): Promise<FetchReviewsResponse> => {
    console.log('🚀 Making API request to:', `${API_URL}/api/reviews/fetch`);
    console.log('📍 Place parameter:', place);
    
    try {
      const response = await api.get<FetchReviewsResponse>('/reviews/fetch', {
        params: {
          place: place
        }
      });
      
      console.log('✅ API Response received:', response.status, response.statusText);
      console.log('📦 Response data:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ API Request failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('🔍 Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        });
      }
      throw error;
    }
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

  // Fetch and analyze reviews - returns the new format
  fetchAndAnalyze: async (place: string): Promise<PlaceDataResponse> => {
    console.log('🚀 Making API request to:', `${API_URL}/api/reviews/fetch`);
    console.log('📍 Place parameter:', place);
    
    try {
      const response = await api.get<PlaceDataResponse>('/reviews/fetch', {
        params: {
          place: place
        }
      });
      
      console.log('✅ API Response received:', response.status, response.statusText);
      console.log('📦 Response data:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ API Request failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('🔍 Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        });
      }
      throw error;
    }
  },
};

