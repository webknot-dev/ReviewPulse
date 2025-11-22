import axios from 'axios';
require('dotenv').config();


export interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  relative_time_description?: string;
}

export interface GooglePlaceDetails {
  place_id: string;
  name: string;
  formatted_address?: string;
  types?: string[];
  rating?: number;
  user_ratings_total?: number;
  reviews?: GoogleReview[];
}

/**
 * Fetches place details and reviews from Google Places API
 * Falls back to mock data if API key is not available
 */
export const fetchPlaceDetails = async (
  place: string
): Promise<GooglePlaceDetails> => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const baseUrlPlace = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json"
    const baseUrlDetails = "https://maps.googleapis.com/maps/api/place/details/json"

  if (!apiKey || apiKey === 'your_google_places_api_key_here') {
    console.log('⚠️ Google Places API key not found, using mock data');
    return getMockPlaceData(place);
  }

  try {
      // Step 1: Search the place
      const searchRes = await axios.get(baseUrlPlace, {
          params: {
              input: place,
              inputtype: "textquery",
              fields: "place_id",
              key: apiKey
          }
      });

      const placeId = searchRes.data.candidates[0].place_id;

      // Step 2: Fetch reviews
      const reviewsRes = await axios.get(baseUrlDetails, {
          params: {
              place_id: placeId,
              fields: "name,rating,reviews,formatted_address",
              key: apiKey,
          }
      });

      let placeDetails = reviewsRes.data.result;

      return {
          place_id: placeId,
          name: placeDetails.name,
          formatted_address: placeDetails.formatted_address,
          types: ['restaurant', 'food', 'establishment'],
          rating: placeDetails.rating,
          user_ratings_total: placeDetails.rating,
          reviews: placeDetails.reviews,
      };

  } catch (error) {
      console.error('❌ Error fetching from Google Places API:', error);
      console.log('📦 Falling back to mock data');
      return getMockPlaceData(place);
  }
};

/**
/**
 * Mock data generator for development/testing
 */
const getMockPlaceData = (placeId: string): GooglePlaceDetails => {
  const mockReviews: GoogleReview[] = [
    {
      author_name: 'John Doe',
      rating: 5,
      text: 'Amazing experience! The service was excellent and the food was delicious. Highly recommend this place.',
      time: Math.floor((Date.now() - 2 * 24 * 60 * 60 * 1000) / 1000), // 2 days ago
    },
    {
      author_name: 'Jane Smith',
      rating: 4,
      text: 'Great atmosphere and friendly staff. The only downside was the wait time, but overall a good experience.',
      time: Math.floor((Date.now() - 5 * 24 * 60 * 60 * 1000) / 1000), // 5 days ago
    },
    {
      author_name: 'Mike Johnson',
      rating: 3,
      text: 'Average experience. The food was okay but nothing special. Service was slow.',
      time: Math.floor((Date.now() - 10 * 24 * 60 * 60 * 1000) / 1000), // 10 days ago
    },
    {
      author_name: 'Sarah Williams',
      rating: 5,
      text: 'Perfect! Everything was outstanding. Will definitely come back again.',
      time: Math.floor((Date.now() - 15 * 24 * 60 * 60 * 1000) / 1000), // 15 days ago
    },
    {
      author_name: 'David Brown',
      rating: 2,
      text: 'Disappointing. The food was cold and the service was terrible. Not worth the price.',
      time: Math.floor((Date.now() - 20 * 24 * 60 * 60 * 1000) / 1000), // 20 days ago
    },
    {
      author_name: 'Emily Davis',
      rating: 4,
      text: 'Nice place with good vibes. The menu has great variety and prices are reasonable.',
      time: Math.floor((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000), // 30 days ago
    },
    {
      author_name: 'Chris Wilson',
      rating: 5,
      text: 'Best experience ever! The staff went above and beyond. Food quality is top-notch.',
      time: Math.floor((Date.now() - 45 * 24 * 60 * 60 * 1000) / 1000), // 45 days ago
    },
    {
      author_name: 'Lisa Anderson',
      rating: 1,
      text: 'Terrible service and overpriced. Would not recommend to anyone.',
      time: Math.floor((Date.now() - 60 * 24 * 60 * 60 * 1000) / 1000), // 60 days ago
    },
    {
      author_name: 'Tom Martinez',
      rating: 4,
      text: 'Good food and nice ambiance. The only issue was parking availability.',
      time: Math.floor((Date.now() - 90 * 24 * 60 * 60 * 1000) / 1000), // 90 days ago
    },
    {
      author_name: 'Amy Taylor',
      rating: 5,
      text: 'Absolutely fantastic! Every aspect exceeded expectations. A must-visit place.',
      time: Math.floor((Date.now() - 120 * 24 * 60 * 60 * 1000) / 1000), // 120 days ago
    },
  ];

  return {
    place_id: placeId,
    name: 'Sample Restaurant',
    formatted_address: '123 Main Street, City, State 12345',
    types: ['restaurant', 'food', 'establishment'],
    rating: 4.2,
    user_ratings_total: 150,
    reviews: mockReviews,
  };
};

