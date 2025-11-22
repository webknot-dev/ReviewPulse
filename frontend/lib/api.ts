import axios from 'axios';
import { tokenStorage } from './auth';

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
  timeout: 10000, // 10 second timeout
  withCredentials: true, // Include credentials for CORS
});

// Add request interceptor for auth token and debugging
api.interceptors.request.use(
  (config) => {
    // Add auth token to requests
    const token = tokenStorage.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
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
      
      const token = tokenStorage.get();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
        credentials: 'include'
      });
      
      console.log('🧪 Fetch response:', {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        (error as any).response = { status: response.status, data: errorData };
        throw error;
      }
      
      const data = await response.json();
      console.log('🧪 Fetch data:', data);
      return data;
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
};

