import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchVideoList = async () => {
  const userId = localStorage.getItem("userId");


  try {
    const response = await axios.get(`${API_BASE_URL}/getAllVideos`, {
      params: { userId },
    });

    return response.data;
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 500) {
      throw new Error("Something went wrong, please try again.");
    }

    throw new Error(message || "There was an error while fetching the videos.");
  }
};
