import mongoose from "mongoose";

const VideoProgressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    videoUrl: { type: String, required: true },
    watched: { type: [Number], default: [] },
    currentTime: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const VideoProgress = mongoose.model(
  "VideoProgress",
  VideoProgressSchema
);
