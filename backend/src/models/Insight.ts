import mongoose, { Schema, Document } from 'mongoose';

export interface ITrendData {
  period: string;
  averageRating: number;
  totalReviews: number;
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export interface IInsight extends Document {
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
    week?: ITrendData;
    month?: ITrendData;
    year?: ITrendData;
    all?: ITrendData;
  };
  lastProcessed: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InsightSchema = new Schema<IInsight>(
  {
    placeId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    summary: {
      type: String,
      required: true,
    },
    positiveHighlights: [String],
    negativeHighlights: [String],
    sentimentBreakdown: {
      positive: { type: Number, default: 0 },
      negative: { type: Number, default: 0 },
      neutral: { type: Number, default: 0 },
    },
    topics: [
      {
        name: String,
        count: Number,
        sentiment: {
          type: String,
          enum: ['positive', 'negative', 'neutral'],
        },
      },
    ],
    trends: {
      week: {
        period: String,
        averageRating: Number,
        totalReviews: Number,
        sentimentBreakdown: {
          positive: Number,
          negative: Number,
          neutral: Number,
        },
      },
      month: {
        period: String,
        averageRating: Number,
        totalReviews: Number,
        sentimentBreakdown: {
          positive: Number,
          negative: Number,
          neutral: Number,
        },
      },
      year: {
        period: String,
        averageRating: Number,
        totalReviews: Number,
        sentimentBreakdown: {
          positive: Number,
          negative: Number,
          neutral: Number,
        },
      },
      all: {
        period: String,
        averageRating: Number,
        totalReviews: Number,
        sentimentBreakdown: {
          positive: Number,
          negative: Number,
          neutral: Number,
        },
      },
    },
    lastProcessed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Insight = mongoose.model<IInsight>('Insight', InsightSchema);

