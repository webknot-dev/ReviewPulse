import {GooglePlaceDetails} from "./googleService";
import { GoogleGenAI } from "@google/genai";

export interface AnalysedReviewData {
    place_name: string,
    rating?: number,
    pos_reviews: Array<AnalysedReview>,
    neg_reviews: Array<AnalysedReview>,
    overall_sentiment: string,
    highlights: Array<string>,
    total_reviews?: number,
    category: string,
    attributes_analyzed: {},
    possible_filters: string[],
}

export interface AnalysedReview {
    text: string,
    mentions: number
}

const prompt = `You are an AI system that analyzes Google reviews.

Input: A list of reviews in JSON.

Task:
1. Categorize each review as "positive", "negative", or "neutral".
2. Analyse each review as "positive", "positive", "neutral".
3. Find the overall sentiment (positive/negative/neutral).
4. Give the highlights based on the reviews.
    Eg: This kind of food is famous in this restaurant or this place is famous for this etc..
5. Add mentions an extra value to each review which will be the number of same kind or closely relatable reviews are there.  
6. Categorize the type of the place based on any of the below given types: (should be added in the result)
    a. restaurant
    Includes: restaurants, cafés, bakeries, fast food, bars, pubs, street food.
    attributes_analyzed: service quality, most mentioned staff, top dishes, ambience sentiment
    
    b. hotel
    Includes: hotels, resorts, hostels, homestays, serviced apartments.
    attributes_analyzed: top appreciated facility, hygiene score, top features

    c. education
    Includes: schools, colleges, universities, coaching centers, training institutes.
    attributes_analyzed: overall quality, quality of teaching, top recommended teachers, student quality

    d. retail
    Includes: supermarkets, clothing stores, malls, electronics shops, furniture stores.
    attributes_analyzed: most mentioned products, pricing sentiment, staff behaviour, checkout speed, discounts

    e. health
    Includes: hospitals, clinics, dental clinics, diagnostic centers, pharmacies.
    attributes_analyzed: appreciated staffs, waiting time experience, hygiene, patient care sentiment, diagnosis accuracy

    f. financial
    Includes: banks, salons, repair services, gyms, spas, law offices, consultants.
    attributes_analyzed: most mentioned service teams, service speed, professional skills sentiment, hygiene, pricing fairness, staff friendliness

    g. venue
    Includes: movie theaters, parks, gaming zones, museums, tourist attractions.
    attributes_analyzed: top movies/activities, audio/video quality, hygiene, parking availability sentiment, ambiance

    h. service-center
    Includes: petrol pumps, car/bike service centers, metro stations, bus stations, parking areas.
    attributes_analyzed: service quality mentions, employee praised, parts quality feedback, fuel quality, service time
    
    i. other
7.  After categorizing analyze the values (using the reviews) for all the attributes under each category based on given records
    
8. Return ONLY JSON in the following format:

{
   "positive": [{text: "...", mentions: 2}],
  "negative": [{text: "...", mentions: 2}],
  "overall_sentiment": "...",
  "highlights": ["..."],
  "summary": "..."
  "category": "..." (any of the given types)
  "attributes_analyzed": {"...": "..."}
}
`;

/**
 * Analyzes sentiment of a chunk of reviews
 */
export const analyzeSentiment = async (placeData: GooglePlaceDetails): Promise<AnalysedReviewData> => {
    try {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY is not set in environment variables');
        }

        if (!placeData.reviews || placeData.reviews.length === 0) {
            throw new Error('No reviews available to analyze');
        }

        const ai = new GoogleGenAI({apiKey: process.env.OPENAI_API_KEY});

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    text: prompt
                },
                {
                    text: JSON.stringify(placeData.reviews)
                }
            ],
        });

        // Handle different response structures
        const responseText = response.text || response.response?.text || JSON.stringify(response);
        
        if (!responseText) {
            throw new Error('No response text from AI service');
        }

        let formattedGenAiResponse = extractJsonFromGenAiResponse(responseText)

    let oneWeekBack = new Date().getTime() - (7*24*60*60*1000);
    let oneMonthBack = new Date().getTime() - (30*24*60*60*1000);
    let oneYearBack = new Date().getTime() - (365*24*60*60*1000);

    let possibleFilters: Set<string> = new Set();
    possibleFilters.add("all")
    placeData.reviews?.forEach((item) => {
        if (item.time > oneWeekBack) {
            possibleFilters.add("Week");
        } else if (item.time > oneMonthBack) {
            possibleFilters.add("Month");
        } else if (item.time > oneYearBack) {
            possibleFilters.add("Year");
        }
    })

        // Validate and provide defaults for missing fields
        return {
            place_name: placeData.name || 'Unknown Place',
            rating: placeData.rating || 0,
            pos_reviews: formattedGenAiResponse.positive || [],
            neg_reviews: formattedGenAiResponse.negative || [],
            overall_sentiment: formattedGenAiResponse.overall_sentiment || 'neutral',
            highlights: formattedGenAiResponse.highlights || [],
            total_reviews: placeData.reviews?.length || 0,
            category: formattedGenAiResponse.category || 'other',
            attributes_analyzed: formattedGenAiResponse.attributes_analyzed || {},
            possible_filters: [...possibleFilters],
        }
    } catch (error) {
        console.error('Error in analyzeSentiment:', error);
        throw new Error(`Failed to analyze sentiment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};


function extractJsonFromGenAiResponse(text:any) {
    try {
        // remove code blocks like ```json ... ```
        const cleaned = text.replace(/```json|```/g, '').trim();
        return JSON.parse(cleaned);
    } catch (err) {
        console.error("JSON Parse Error:", err);
        throw new Error("Invalid JSON from AI");
    }
}