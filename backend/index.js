import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { VideoProgress } from "./model/user-video-progress.js";
import { mongoosedatabse } from "./utils/db.js";
import progressRouter from "./routes/progress-router.js";

dotenv.config();

const app = express();

app.use(express.json());

const corsOptions = {
  origin: [
    process.env.FRONTEND_URL1,
    process.env.FRONTEND_URL2,
    process.env.FRONTEND_URL3,
  ],
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("https://video-progress-tracker-coral.vercel.app/");
});

app.get("/test1", (req, res) => {
  res.send("test1");
});


// app.get("/test2", (req, res) => {
//   res.send("test2");
// });

// app.get("/test3", (req, res) => {
//   res.send("test3");
// });

app.use("/api", progressRouter);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL1,
      process.env.FRONTEND_URL2,
      process.env.FRONTEND_URL3,
    ],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("video-progress", async (data) => {
    try {
      await updateVideoProgressWithSocket(data);
    } catch (error) {
      console.error("Error handling socket video-progress:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const updateVideoProgressWithSocket = async ({
  userId,
  videoId,
  currentTime,
  watchedSeconds = [],
}) => {
  if (!userId || !videoId) {
    console.warn("Missing userId or videoId");
    return;
  }

  const videoProgressDoc = await VideoProgress.findOne({
    _id: videoId,
    userId,
  });
  if (!videoProgressDoc) {
    console.warn("Video progress not found for user", userId);
    return;
  }

  const updateResult = await VideoProgress.updateOne(
    { _id: videoId, userId },
    {
      $set: { currentTime },
      $addToSet: {
        watched: { $each: watchedSeconds },
      },
    }
  );

  if (updateResult.modifiedCount > 0) {
    console.log(`Progress updated for user ${userId}, video ${videoId}`);
  } else {
    console.log("No changes made to video progress");
  }
};

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  mongoosedatabse();
  console.log(`Server listening on port ${PORT}`);
});
