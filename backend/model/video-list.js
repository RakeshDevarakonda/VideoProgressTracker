import mongoose from "mongoose";

const videoListSchema = new mongoose.Schema({
  videoUrl: {
    type: String,
  },
});

export const VideoList = mongoose.model("VideoList", videoListSchema);
