import OpenAI from 'openai';
import { IReview } from '../models/Review';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CHUNK_SIZE = 20; // Process 20 reviews at a time

/**
 * Chunks reviews into smaller batches for AI processing
 */
export const chunkReviews = (reviews: IReview[], chunkSize: number = CHUNK_SIZE): IReview[][] => {
  const chunks: IReview[][] = [];
  for (let i = 0; i < reviews.length; i += chunkSize) {
    chunks.push(reviews.slice(i, i + chunkSize));
  }
  return chunks;
};

/**
 * Generates a summary for a chunk of reviews
 */
export const generateSummary = async (chunk: IReview[]): Promise<string> => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    return `Summary of ${chunk.length} reviews: Mixed feedback with various ratings and comments.`;
  }

  try {
    const reviewsText = chunk
      .map((r, idx) => `Review ${idx + 1} (Rating: ${r.rating}/5): ${r.text}`)
      .join('\n\n');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert at analyzing customer reviews. Provide concise summaries highlighting key points.',
        },
        {
          role: 'user',
          content: `Summarize the following reviews in 2-3 sentences:\n\n${reviewsText}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    return response.choices[0]?.message?.content || 'Unable to generate summary';
  } catch (error) {
    console.error('Error generating summary:', error);
    return `Summary of ${chunk.length} reviews: Analysis unavailable.`;
  }
};

/**
 * Extracts topics from a chunk of reviews
 */
export const extractTopics = async (chunk: IReview[]): Promise<Array<{ name: string; count: number; sentiment: 'positive' | 'negative' | 'neutral' }>> => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    return [
      { name: 'Service', count: 5, sentiment: 'positive' },
      { name: 'Food Quality', count: 4, sentiment: 'positive' },
      { name: 'Wait Time', count: 2, sentiment: 'negative' },
    ];
  }

  try {
    const reviewsText = chunk
      .map((r, idx) => `Review ${idx + 1} (Rating: ${r.rating}/5): ${r.text}`)
      .join('\n\n');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert at extracting topics from reviews. Return a JSON array of topics with name, count, and sentiment (positive/negative/neutral).',
        },
        {
          role: 'user',
          content: `Extract the main topics mentioned in these reviews. Return JSON array format: [{"name": "topic", "count": number, "sentiment": "positive|negative|neutral"}]\n\n${reviewsText}`,
        },
      ],
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);
    return parsed.topics || parsed || [];
  } catch (error) {
    console.error('Error extracting topics:', error);
    return [];
  }
};

/**
 * Analyzes sentiment of a chunk of reviews
 */
export const analyzeSentiment = async (chunk: IReview[]): Promise<{
  positive: number;
  negative: number;
  neutral: number;
}> => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    // Fallback: use rating-based sentiment
    const positive = chunk.filter((r) => r.rating >= 4).length;
    const negative = chunk.filter((r) => r.rating <= 2).length;
    const neutral = chunk.length - positive - negative;
    return { positive, negative, neutral };
  }

  try {
    const reviewsText = chunk
      .map((r) => `Rating: ${r.rating}/5 - ${r.text}`)
      .join('\n\n');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'Analyze the sentiment of these reviews. Return JSON with counts: {"positive": number, "negative": number, "neutral": number}',
        },
        {
          role: 'user',
          content: `Analyze sentiment of these reviews:\n\n${reviewsText}`,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);
    return {
      positive: parsed.positive || 0,
      negative: parsed.negative || 0,
      neutral: parsed.neutral || 0,
    };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    // Fallback to rating-based sentiment
    const positive = chunk.filter((r) => r.rating >= 4).length;
    const negative = chunk.filter((r) => r.rating <= 2).length;
    const neutral = chunk.length - positive - negative;
    return { positive, negative, neutral };
  }
};

/**
 * Extracts positive highlights from reviews
 */
export const extractPositiveHighlights = async (reviews: IReview[]): Promise<string[]> => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    return [
      'Excellent service and friendly staff',
      'High-quality food and great atmosphere',
      'Good value for money',
    ];
  }

  try {
    const positiveReviews = reviews.filter((r) => r.rating >= 4);
    if (positiveReviews.length === 0) return [];

    const reviewsText = positiveReviews
      .map((r) => `${r.text}`)
      .slice(0, 30) // Limit to 30 reviews
      .join('\n\n');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'Extract the top 5-7 positive highlights from these reviews. Return as JSON array: ["highlight1", "highlight2", ...]',
        },
        {
          role: 'user',
          content: `What are people praising the most in these positive reviews?\n\n${reviewsText}`,
        },
      ],
      temperature: 0.6,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);
    return parsed.highlights || parsed.positiveHighlights || [];
  } catch (error) {
    console.error('Error extracting positive highlights:', error);
    return [];
  }
};

/**
 * Extracts negative highlights from reviews
 */
export const extractNegativeHighlights = async (reviews: IReview[]): Promise<string[]> => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    return [
      'Long wait times during peak hours',
      'Inconsistent service quality',
      'Limited parking availability',
    ];
  }

  try {
    const negativeReviews = reviews.filter((r) => r.rating <= 2);
    if (negativeReviews.length === 0) return [];

    const reviewsText = negativeReviews
      .map((r) => `${r.text}`)
      .slice(0, 30) // Limit to 30 reviews
      .join('\n\n');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'Extract the top 5-7 common complaints from these reviews. Return as JSON array: ["complaint1", "complaint2", ...]',
        },
        {
          role: 'user',
          content: `What are the most common complaints in these negative reviews?\n\n${reviewsText}`,
        },
      ],
      temperature: 0.6,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);
    return parsed.complaints || parsed.negativeHighlights || [];
  } catch (error) {
    console.error('Error extracting negative highlights:', error);
    return [];
  }
};

/**
 * Merges insights from all chunks into a final summary
 */
export const mergeInsights = async (
  allChunks: IReview[][],
  allSummaries: string[],
  allTopics: Array<Array<{ name: string; count: number; sentiment: 'positive' | 'negative' | 'neutral' }>>,
  allSentiments: Array<{ positive: number; negative: number; neutral: number }>
): Promise<{
  summary: string;
  topics: Array<{ name: string; count: number; sentiment: 'positive' | 'negative' | 'neutral' }>;
  sentimentBreakdown: { positive: number; negative: number; neutral: number };
}> => {
  // Merge summaries
  const combinedSummary = allSummaries.join(' ');

  // Merge sentiment counts
  const sentimentBreakdown = allSentiments.reduce(
    (acc, curr) => ({
      positive: acc.positive + curr.positive,
      negative: acc.negative + curr.negative,
      neutral: acc.neutral + curr.neutral,
    }),
    { positive: 0, negative: 0, neutral: 0 }
  );

  // Merge and aggregate topics
  const topicMap = new Map<string, { count: number; sentiment: 'positive' | 'negative' | 'neutral' }>();
  
  allTopics.forEach((topics) => {
    topics.forEach((topic) => {
      const existing = topicMap.get(topic.name);
      if (existing) {
        existing.count += topic.count;
      } else {
        topicMap.set(topic.name, { ...topic });
      }
    });
  });

  const topics = Array.from(topicMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 topics

  // Generate final summary using AI if available
  let finalSummary = combinedSummary;
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Create a concise overall summary (3-4 sentences) from these review summaries.',
          },
          {
            role: 'user',
            content: `Create an overall summary:\n\n${combinedSummary}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 250,
      });
      finalSummary = response.choices[0]?.message?.content || combinedSummary;
    } catch (error) {
      console.error('Error generating final summary:', error);
    }
  }

  return {
    summary: finalSummary,
    topics,
    sentimentBreakdown,
  };
};

