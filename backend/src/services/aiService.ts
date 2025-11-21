import {GooglePlaceDetails} from "./googleService";
import { GoogleGenAI } from "@google/genai";

export interface AnalysedReviewData {
    place_name: string,
    rating?: number,
    pos_reviews: Array<string>,
    neg_reviews: Array<string>,
    overall_sentiment: string,
    highlights: Array<string>,
}

const prompt = `You are an AI system that analyzes Google reviews.

Input: A list of reviews in JSON.

Task:
1. Categorize each review as "positive", "negative", or "neutral".
2. Analyse each review as "positive", "positive", "neutral".
3. Find the overall sentiment (positive/negative/neutral).
4. Give the highlights based on the reviews.
    Eg: This kind of food is famous in this restaurant or this place is famous for this etc..
5. Return ONLY JSON in the following format:

{
   "positive": ["..."],
  "negative": ["..."],
  "overall_sentiment": "...",
  "highlights": ["..."],
  "summary": "..."
}
`;

/**
 * Analyzes sentiment of a chunk of reviews
 */
export const analyzeSentiment = async (placeData: GooglePlaceDetails): Promise<AnalysedReviewData> => {

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

    let formattedGenAiResponse = extractJsonFromGenAiResponse(response.text)

    return {
        place_name: placeData.name,
        rating: placeData.rating,
        pos_reviews: formattedGenAiResponse.positive,
        neg_reviews: formattedGenAiResponse.negative,
        overall_sentiment: formattedGenAiResponse.overall_sentiment,
        highlights: formattedGenAiResponse.highlights,
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

