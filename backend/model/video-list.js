import mongoose from "mongoose";

const videoListSchema = new mongoose.Schema({
  videoUrl: {
    type: String,
  },
  duration: { type: Number, default: 0 },
});

export const VideoList = mongoose.model("VideoList", videoListSchema);
