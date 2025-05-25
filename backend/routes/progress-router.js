import express from "express";
import {
  getAllVideosController,
  updateProgress,
} from "../controllers/progressController.js";
import { User } from "../model/user-details.js";

const progressRouter = express.Router();

progressRouter.get("/getAllVideos", getAllVideosController);

progressRouter.put("/updateProgress", updateProgress);

progressRouter.put("/updateLastPlayed", async (req, res) => {
  try {
    const { userId, videoUrl } = req.body;

    await User.updateOne({ userId }, { $set: { lastPlayedUrl: videoUrl } });
    res.send("ok");
  } catch (error) {
    console.log(error);
  }
});

export default progressRouter;
