import { v4 as uuidv4 } from "uuid";
import { VideoProgress } from "../model/user-video-progress.js";
import { VideoList } from "./../model/video-list.js";
import { User } from "./../model/user-details.js";

export const getAllVideosController = async (req, res) => {
  try {
    console.log("Received getcontroller request");

    let { userId } = req.query;

    let existingProgress = [];
    let lastplayedUser = null;

    if (userId) {
      existingProgress = await VideoProgress.find({ userId });
      lastplayedUser = await User.findOne({ userId });
    }

    if (!userId || existingProgress.length === 0) {
      userId = uuidv4();

      lastplayedUser = new User({ userId, lastPlayedUrl: null });
      await lastplayedUser.save();

      const allVideos = await VideoList.find();
      console.log(allVideos);

      const progressToCreate = allVideos.map((video) => ({
        userId,
        videoUrl: video.videoUrl,
        watchedSeconds: [],
        currentTime: 0,
        duration: video.duration,
      }));

      await VideoProgress.insertMany(progressToCreate);
      existingProgress = await VideoProgress.find({ userId });
    }

    res.json({
      userId,
      progress: existingProgress,
      lastPlayedUrl: lastplayedUser ? lastplayedUser.lastPlayedUrl : null,
    });
  } catch (err) {
    console.error("getOrCreateProgress error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProgress = async (req, res) => {
  try {
    console.log("Received updateProgress request");

    const { userId, videoId, currentTime, watchedSeconds } =
      req.body;

    if (!userId || !videoId) {
      return res
        .status(400)
        .json({ message: "User ID and Video ID are required" });
    }

    const videoProgressDoc = await VideoProgress.findOne({
      _id: videoId,
      userId,
    });

    if (!videoProgressDoc) {
      return res
        .status(404)
        .json({ message: "Video progress not found for user" });
    }

    console.log(User);
    const updateFields = {
      currentTime,
    };

    const updateResult = await VideoProgress.updateOne(
      { _id: videoId, userId },
      {
        $set: updateFields,
        $addToSet: {
          watched: { $each: watchedSeconds || [] },
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      return res
        .status(200)
        .json({ message: "No changes made to video progress" });
    }

    res.status(200).json({ message: "Video progress updated successfully" });
  } catch (error) {
    console.error("Error updating video progress:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
