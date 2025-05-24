const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from "axios";

export const fetchVideoList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAllVideos`);
    return response.data;
  } catch (error) {
    let errorMessage;
    if (error.response?.status === 500) {
      errorMessage = "Something went wrong please try again";
    } else {
      errorMessage =
        error.response?.data?.message ||
        "There was an error while fetching the post";
    }
    throw new Error(errorMessage);
  }
};
