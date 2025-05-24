import { useQuery } from "@tanstack/react-query";
import { fetchVideoList } from "../Apis/VideoListAPi";

export const useGetVideoList = () => {
  return useQuery({
    queryKey: ["getVideoList"],
    queryFn: fetchVideoList,
    onSuccess: (data) => {
      console.log("✅ Auth fetch successful:", data);
    },
    onError: (error) => {
      console.error("❌ Error fetching auth:", error.message);
    },
  });
};
