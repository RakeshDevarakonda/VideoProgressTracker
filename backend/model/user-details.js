import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  lastPlayedUrl: {
    type: String,
  },
});

export const User = mongoose.model("User", userSchema);
