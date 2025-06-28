import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const saveVideoProgress = async (data) => {

  try {
    const response = await axios.put(`${API_BASE_URL}/api/updateProgress`, {
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
  try {
    const response = await axios.put(`${API_BASE_URL}/api/updateLastPlayed`, {
      userId: localStorage.getItem("userId"),
      videoUrl,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update last played video", error);
    throw error;
  }
};
