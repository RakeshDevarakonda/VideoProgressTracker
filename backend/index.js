import express from "express";
import { mongoosedatabse } from "./utils/db.js";
import progressRouter from "./routes/progress-router.js";
const app = express();
import cors from "cors";
import "dotenv/config";

app.get("/", (req, res) => {
  res.send("index");
});

app.use(express.json());
app.use(cors());

app.use("/api", progressRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  mongoosedatabse();
  console.log("Example app listening on port " + PORT + "!");
});
