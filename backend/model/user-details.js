import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  lastPlayedUrl: {
    type: String,
    default: null,
  },
});

export const User = mongoose.model("User", userSchema);
