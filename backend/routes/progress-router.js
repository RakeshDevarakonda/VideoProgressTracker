import express from "express";
import {
  getAllVideosController,
  updateProgress,
} from "../controllers/progressController.js";

const progressRouter = express.Router();

progressRouter.get("/getAllVideos", getAllVideosController);

progressRouter.put("/updateProgress", updateProgress);

export default progressRouter;
