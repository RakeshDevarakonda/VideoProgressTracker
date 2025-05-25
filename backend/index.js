import express from "express";
import { mongoosedatabse } from "./utils/db.js";
import progressRouter from "./routes/progress-router.js";
const app = express();
import cors from "cors";
import "dotenv/config";

app.get("/", (req, res) => {
  res.redirect("https://video-progress-tracker-coral.vercel.app/");
});

app.use(express.json());

const corsOptions = {
  origin: [
    process.env.FRONTEND_URL1,
    process.env.FRONTEND_URL2,
    process.env.FRONTEND_URL3,
  ],
};
app.use(cors(corsOptions));

app.use("/api", progressRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  mongoosedatabse();
  console.log("Example app listening on port " + PORT + "!");
});
