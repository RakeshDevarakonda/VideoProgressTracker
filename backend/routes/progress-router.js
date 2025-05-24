import express from "express";
import { getAllVideosController } from "../controllers/progressController.js";
import { VideoList } from "../model/video-list.js";
import { User } from "../model/user-details.js";

const progressRouter = express.Router();

progressRouter.get("/getAllVideos", getAllVideosController);

progressRouter.put("/updateProgress", async (req, res) => {
  const { userId, videoUrl, watchedSeconds, currentTime } = req.body;

  if (!userId || !videoUrl) {
    return res.status(400).json({ error: "userId and videoUrl are required" });
  }

  try {
    let user = await User.findOne({ userId });
    if (!user) {
      user = new User({ userId, lastPlayedUrl: videoUrl });
    } else {
      user.lastPlayedUrl = videoUrl;
    }
    await user.save();

    let progress = await UserVideoProgress.findOne({
      userId: user._id,
      videoUrl,
    });

    if (!progress) {
      progress = new UserVideoProgress({
        userId: user._id,
        videoUrl,
        watchedSeconds,
        currentTime,
      });
    } else {
      const combinedSeconds = new Set([
        ...progress.watchedSeconds,
        ...watchedSeconds,
      ]);
      progress.watchedSeconds = Array.from(combinedSeconds).sort(
        (a, b) => a - b
      );
      progress.currentTime = currentTime;
    }

    await progress.save();
    res.status(200).json({ message: "Progress updated successfully" });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

progressRouter.post("/postNewData", async (req, res) => {
  try {
    const newProgress = new VideoList(req.body);
    const savedProgress = await newProgress.save();
    res.status(201).json(savedProgress);
  } catch (error) {
    console.error("Error saving progress:", error);
    res.status(500).json({ error: "Failed to save progress" });
  }
});

export default progressRouter;
