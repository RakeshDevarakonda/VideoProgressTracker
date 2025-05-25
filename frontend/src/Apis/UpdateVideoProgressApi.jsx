import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const saveVideoProgress = async (data) => {
  console.log("updated called")

  try {
    const response = await axios.put(`${API_BASE_URL}/updateProgress`, {
      userId: localStorage.getItem("userId"),
      ...data,
    });
    return response.data;
  } catch (error) {
    console.error("Progress save failed:", error);
    throw error;
  }
};

export const updateLastPlayedVideo = async (videoUrl) => {
  console.log("lastplayed called")
  try {
    const response = await axios.put(`${API_BASE_URL}/updateLastPlayed`, {
      userId: localStorage.getItem("userId"),
      videoUrl,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update last played video", error);
    throw error;
  }
};
