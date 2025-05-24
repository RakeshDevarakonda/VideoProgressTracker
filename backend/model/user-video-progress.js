import mongoose, { Schema } from "mongoose";

const userVideoProgressTrack = new Schema({
  watchedSeconds: {
    type: [Number],
    default: [],
  },
  videoUrl: {
    type: String,
    required: true,
  },
  currentTime: {
    type: Number,
    default: 0,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export const UserVideoProgress = mongoose.model(
  "UserVideoProgress",
  userVideoProgressTrack
);
