import { useQuery } from "@tanstack/react-query";
import { fetchVideoList } from "../Apis/VideoListAPi";

export const useGetVideoList = () => {
  return useQuery({
    queryKey: ["getVideoList"],
    queryFn: fetchVideoList,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 120,
  });
};
