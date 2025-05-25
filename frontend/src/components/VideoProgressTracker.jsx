import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import VideoList from "./VideoList";
import VideoPlayer from "./VideoPlayer";
import { useGetVideoList } from "../TanstackQueries/GetAllVideosQuery";
import {
  setVideoList,
  setSelectedVideo,
  videoProgressSelector,
  setInitialVideoProgress,
} from "../Redux/VideoListRedux.jsx";

const VideoProgressTracker = () => {
  const dispatch = useDispatch();
  const { data, isSuccess } = useGetVideoList();

  useEffect(() => {
    if (data && isSuccess) {
      const newData = data.progress;
      const userId = data.userId;
      const lastPlayedUrl = data.lastPlayedUrl;

      let dataIndex = 0;

      if (lastPlayedUrl) {
        const index = newData.findIndex((e) => e.videoUrl === lastPlayedUrl);
        dataIndex = index !== -1 ? index : 0;
      }

      localStorage.setItem("userId", userId);
      dispatch(setVideoList(newData));
      dispatch(setSelectedVideo(newData[dataIndex]));
      dispatch(setInitialVideoProgress(newData));
    }
  }, [data, isSuccess, dispatch]);

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
