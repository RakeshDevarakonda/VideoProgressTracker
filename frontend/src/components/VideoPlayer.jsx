import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Play, Pause, RotateCcw, Clock, CheckCircle } from "lucide-react";
import axios from "axios";

import {
  setIsPlaying,
  resetProgress,
  updateVideoProgress,
  videoProgressSelector,
} from "../Redux/VideoListRedux.jsx";
import { secondsToIntervals, formatTime } from "../utils/utils";

const VideoPlayer = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useDispatch();
  const videoRef = useRef(null);

  const lastTimeRef = useRef(0);

  const { selectedVideo, videoProgressMap, isPlaying } = useSelector(
    videoProgressSelector
  );

  const duration = videoProgressMap[selectedVideo?._id]?.duration;

  const currentTime = videoProgressMap[selectedVideo?._id]?.currentTime;

  const watchedSeconds = useMemo(() => {
    return new Set(videoProgressMap[selectedVideo?._id]?.watched || []);
  }, [videoProgressMap, selectedVideo?._id]);

  const progressPercent = useMemo(() => {
    const adjustedSize =
      watchedSeconds.size >= 1 ? watchedSeconds.size - 1 : watchedSeconds.size;
    return duration > 0 ? (adjustedSize / duration) * 100 : 0;
  }, [watchedSeconds, duration]);

  const intervals = secondsToIntervals(watchedSeconds);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !selectedVideo?._id) return;

    const handleLoadedMetadata = () => {
      const videoDuration = Math.floor(video.duration);
      const currentVideoId = selectedVideo._id;

      const savedProgress = videoProgressMap[currentVideoId];

      if (savedProgress?.currentTime) {
        video.currentTime = savedProgress.currentTime;
      }

      dispatch(
        updateVideoProgress({
          videoId: currentVideoId,
          currentSecond: 0,
          currentTime: savedProgress?.currentTime || 0,
          duration: videoDuration,
        })
      );
    };

    const handlePlay = () => dispatch(setIsPlaying(true));
    const handlePause = () => {
      dispatch(setIsPlaying(false));
      saveProgressToServer(true);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [selectedVideo, videoProgressMap, dispatch]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !selectedVideo?._id) return;

    let animationId;

    const trackProgress = () => {
      if (!video.paused && !video.ended) {
        const currentSecond = Math.floor(video.currentTime);
        const currentTime = video.currentTime;
        const duration = video.duration;

        dispatch(
          updateVideoProgress({
            videoId: selectedVideo._id,
            currentSecond,
            currentTime,
            duration,
          })
        );
      }

      animationId = requestAnimationFrame(trackProgress);
    };

    animationId = requestAnimationFrame(trackProgress);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [selectedVideo, dispatch]);

  const saveProgressToServer = async (runImmediate) => {
    // console.log(runImmediate);
    const videoProgress = videoProgressMap[selectedVideo?._id];

    if (!videoProgress) return;

    const video = videoRef.current;

    if (!runImmediate) {
      if (!video || !selectedVideo?._id || video.paused || video.ended) return;

      const currentSecond = Math.floor(video.currentTime);

      if (videoProgress?.watched.includes(currentSecond)) return;
    }

    const timeDiff = Math.abs(Date.now() - lastTimeRef.current);

    if (!runImmediate) {
      if (timeDiff < 5000) return;
    }

    try {
      lastTimeRef.current = Date.now();
      await axios.put(`${API_BASE_URL}/updateProgress`, {
        userId: localStorage.getItem("userId"),
        videoId: selectedVideo._id,
        videoUrl: selectedVideo.videoUrl,
        currentTime: video.currentTime,
        duration: video.duration,
        watchedSeconds: videoProgress?.watched || [],
      });

      console.log(videoProgress?.watched);
      console.log("api call");
    } catch (error) {
      console.error("Progress save failed:", error);
    }
  };

  useEffect(() => {
    saveProgressToServer(true);
    lastTimeRef.current = 0;
  }, [selectedVideo?._id]);

  useEffect(() => {
    saveProgressToServer();
  }, [videoProgressMap]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleResetProgress = () => {
    if (selectedVideo?._id) {
      dispatch(resetProgress(selectedVideo._id));
      const video = videoRef.current;
      if (video) {
        video.currentTime = 0;
      }
    }
  };

  if (!selectedVideo) return null;

  return (
    <main className="xl:col-span-3 order-1 xl:order-2">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">
              {selectedVideo.title || "Video Player"}
            </h1>
            <div className="flex items-center gap-2 text-slate-300 text-sm">
              <Clock className="h-4 w-4" />
              <span>{Math.floor(duration)}</span>
            </div>
          </div>
        </div>

        {/* Video Container */}
        <div className="p-6">
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-lg mb-6">
            <video
              ref={videoRef}
              controls
              src={selectedVideo?.videoUrl}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-700">
                  Watch Progress
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {Math.min(Math.round(progressPercent))}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{
                    width: `${Math.min(progressPercent.toFixed(0), 100)}%`,
                  }}
                />
              </div>
              <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                <span>{formatTime(currentTime)}</span>
                <span>
                  {watchedSeconds.size - 1} / {Math.floor(duration)} seconds
                  watched
                </span>
                <span>{Math.floor(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={togglePlayPause}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Play
                  </>
                )}
              </button>

              {/* <button
                onClick={handleResetProgress}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Progress
              </button> */}
            </div>

            {/* Watched Intervals */}
            <div className="bg-slate-50 rounded-xl p-4">
              <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Watched Segments
              </h4>

              {intervals?.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="mx-auto h-12 w-12 text-slate-300 mb-2" />
                  <p className="text-slate-500 italic">
                    No segments watched yet
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Start watching to see your progress
                  </p>
                </div>
              ) : (
                <div className="grid gap-2 overflow-y-auto custom-scrollbar">
                  {intervals?.map(([start, end], index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border-l-4 border-green-400 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-green-600">
                            {index + 1}
                          </span>
                        </div>
                        <span className="font-medium text-slate-700">
                          {formatTime(start)} - {formatTime(end)}
                        </span>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        {end - start + 1}s
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VideoPlayer;
