import mongoose, { Schema, Document } from 'mongoose';

export interface IPlace extends Document {
  placeId: string;
  name: string;
  address?: string;
  types?: string[];
  rating?: number;
  totalReviews?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const PlaceSchema = new Schema<IPlace>(
  {
    placeId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: String,
    types: [String],
    rating: Number,
    totalReviews: Number,
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const Place = mongoose.model<IPlace>('Place', PlaceSchema);

