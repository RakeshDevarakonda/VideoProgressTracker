import express from "express";
import { getSingleProgress } from "../controllers/progressController.js";

const progressRouter = express.Router();

progressRouter.get("/getProgress/:id", getSingleProgress);

export default progressRouter;
