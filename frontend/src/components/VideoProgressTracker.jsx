import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import VideoList from "./VideoList";
import VideoPlayer from "./VideoPlayer";
import { useGetVideoList } from "../TanstackQueries/GetAllVideosQuery";
import {
  setVideoList,
  setSelectedVideo,
  videoProgressSelector,
} from "../Redux/VideoListRedux.jsx";

const VideoProgressTracker = () => {
  const dispatch = useDispatch();
  const { videoList, selectedVideo, videoProgressMap, duration } = useSelector(
    videoProgressSelector
  );
  const { data, isLoading, error, isSuccess } = useGetVideoList();

  useEffect(() => {
    if (data && isSuccess) {
      const newData = data.videos;
      dispatch(setVideoList(newData));
      dispatch(setSelectedVideo(newData[0]));
      console.log(newData);
    }
  }, [data, isSuccess, dispatch]);

  const getVideoProgress = (id) => {
    const watchedArray = videoProgressMap[id]?.watched || [];
    const videoDuration = videoProgressMap[id]?.duration || duration;
    return videoDuration > 0 ? (watchedArray.length / videoDuration) * 100 : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <VideoList
            videoList={videoList || []}
            selectedVideoId={selectedVideo?._id}
            getVideoProgress={getVideoProgress}
          />
          <VideoPlayer />
        </div>
      </div>
    </div>
  );
};

export default VideoProgressTracker;
