import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import VideoList from "./VideoList";
import VideoPlayer from "./VideoPlayer";
import {
  setVideoList,
  setSelectedVideo,
  videoProgressSelector,
  setInitialVideoProgress,
  setUserId,
} from "../Redux/VideoListRedux.jsx";
import { fetchVideoList } from "../Apis/VideoListAPi.jsx";

const VideoProgressTracker = () => {
  const dispatch = useDispatch();

  const { selectedVideo } = useSelector(videoProgressSelector);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchVideoList();

        if (data && data.progress) {
          const newData = data.progress;
          const userId = data.userId;
          const lastPlayedUrl = data.lastPlayedUrl;

          let dataIndex = 0;

          if (lastPlayedUrl) {
            const index = newData.findIndex(
              (e) => e.videoUrl === lastPlayedUrl
            );
            dataIndex = index !== -1 ? index : 0;
          }

          localStorage.setItem("userId", userId);
          dispatch(setVideoList(newData));
          dispatch(setSelectedVideo(newData[dataIndex]));
          dispatch(setInitialVideoProgress(newData));
          dispatch(setUserId(userId))
        }
      } catch (error) {
        console.error("Error fetching video list:", error.message);
      }
    };

    fetchData();
  }, []);

  if (!selectedVideo) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-50"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <VideoList />
          <VideoPlayer />
        </div>
      </div>
    </div>
  );
};

export default VideoProgressTracker;