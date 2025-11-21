// import mongoose, { Schema, Document } from 'mongoose';
//
// export interface IReview extends Document {
//   placeId: string;
//   author: string;
//   rating: number;
//   text: string;
//   time: Date;
//   sentiment?: 'positive' | 'negative' | 'neutral';
//   topics?: string[];
//   createdAt: Date;
//   updatedAt: Date;
// }
//
// const ReviewSchema = new Schema<IReview>(
//   {
//     placeId: {
//       type: String,
//       required: true,
//       index: true,
//     },
//     author: {
//       type: String,
//       required: true,
//     },
//     rating: {
//       type: Number,
//       required: true,
//       min: 1,
//       max: 5,
//     },
//     text: {
//       type: String,
//       required: true,
//     },
//     time: {
//       type: Date,
//       required: true,
//     },
//     sentiment: {
//       type: String,
//       enum: ['positive', 'negative', 'neutral'],
//     },
//     topics: [String],
//   },
//   {
//     timestamps: true,
//   }
// );
//
// // Index for efficient queries
// ReviewSchema.index({ placeId: 1, time: -1 });
//
// export const Review = mongoose.model<IReview>('Review', ReviewSchema);
//
