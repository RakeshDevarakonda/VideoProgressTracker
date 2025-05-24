import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  CheckCircle,
  Video,
} from "lucide-react";
import { useGetVideoList } from "./../TanstackQueries/GetAllVideosQuery";

// Mock data and functions to replace external dependencies
// const mockVideoData = [
//   {
//     _id: "1",
//     title: "Introduction to React Hooks",
//     videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
//     duration: 596
//   },
//   {
//     _id: "2",
//     title: "Advanced State Management",
//     videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
//     duration: 653
//   },
//   {
//     _id: "3",
//     title: "Building Custom Components",
//     videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
//     duration: 15
//   }
// ];

function secondsToIntervals(secondsSet) {
  if (!secondsSet || secondsSet.size === 0) return [];

  const sorted = Array.from(secondsSet).sort((a, b) => a - b);
  const intervals = [];
  let start = sorted[0];
  let prev = start;

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    if (current === prev + 1) {
      prev = current;
    } else {
      intervals.push([start, prev]);
      start = current;
      prev = current;
    }
  }
  intervals.push([start, prev]);
  return intervals;
}

const WatchedVideo = () => {
  const [videoList, setVideoList] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videoRef = useRef(null);

  const { data, isLoading, error, isSuccess } = useGetVideoList();

  useEffect(() => {
    if (data && isSuccess) {
      const NewData = data.videos;
      setVideoList(NewData);
      setSelectedVideo(NewData[0]);
      console.log(NewData);
    }
  }, [data, isSuccess]);

  const [videoProgressMap, setVideoProgressMap] = useState({});
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);


  useEffect(() => {
    const video = videoRef.current;
    if (!video || !selectedVideo?._id) return;

    const handleLoadedMetadata = () => {
      setDuration(Math.floor(video.duration));
      setCurrentTime(0);

      const savedProgress = videoProgressMap[selectedVideo._id];
      if (savedProgress?.currentTime) {
        video.currentTime = savedProgress.currentTime;
        setCurrentTime(savedProgress.currentTime);
      }
    };

    const handleTimeUpdate = () => {
      const currentSecond = Math.floor(video.currentTime);
      setCurrentTime(video.currentTime);

      setVideoProgressMap((prev) => {
        const videoId = selectedVideo._id;
        const videoData = prev[videoId] || {
          watched: new Set(),
          currentTime: 0,
        };

        const newWatched = new Set(videoData.watched);
        newWatched.add(currentSecond);

        return {
          ...prev,
          [videoId]: {
            watched: newWatched,
            currentTime: video.currentTime,
          },
        };
      });
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", () => setIsPlaying(true));
    video.addEventListener("pause", () => setIsPlaying(false));

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", () => setIsPlaying(true));
      video.removeEventListener("pause", () => setIsPlaying(false));
    };
  }, [selectedVideo]);



  const resetProgress = () => {
    setVideoProgressMap((prev) => ({
      ...prev,
      [selectedVideo._id]: {
        watched: new Set(),
        currentTime: 0,
      },
    }));
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const handleVideoSelect = (video) => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setSelectedVideo(video);
    setIsPlaying(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getVideoProgress = (videoId) => {
    const progressData = videoProgressMap[videoId];
    if (!progressData || !progressData.watched) return 0;

    // For playlist items, use the stored duration or estimate
    const videoDuration = videoId === selectedVideo._id ? duration : 600; // fallback duration
    return videoDuration > 0
      ? (progressData.watched.size / videoDuration) * 100
      : 0;
  };

  const watchedSeconds =
    videoProgressMap[selectedVideo?._id]?.watched || new Set();
  const progressPercent =
    duration > 0 ? (watchedSeconds.size / duration) * 100 : 0;
  const intervals = secondsToIntervals(watchedSeconds);

  if (!selectedVideo?._id) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Video className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <p className="text-slate-600">Loading video player...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Sidebar - Video List */}
          <aside className=" xl:col-span-1 order-2 xl:order-1">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Video Playlist
                </h3>
              </div>

              <div className=" p-4 h-100max-h-96 overflow-y-auto custom-scrollbar">
                <div className="space-y-3 ">
                  {videoList.map((video, index) => {
                    const progress = getVideoProgress(video._id);
                    const isActive = selectedVideo?._id === video._id;

                    return (
                      <div
                        key={video._id}
                        onClick={() => handleVideoSelect(video)}
                        className={`group cursor-pointer p-4 rounded-xl transition-all duration-200 border-2 ${
                          isActive
                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-md"
                            : "bg-slate-50 border-transparent hover:bg-slate-100 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              isActive
                                ? "bg-blue-600 text-white"
                                : "bg-slate-300 text-slate-600 group-hover:bg-slate-400"
                            }`}
                          >
                            {index + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4
                              className={`font-semibold text-sm leading-tight mb-2 ${
                                isActive ? "text-blue-900" : "text-slate-800"
                              }`}
                            >
                              {video.title ||
                                video.name ||
                                `Video ${index + 1}`}
                            </h4>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs text-slate-500">
                                <span>Progress</span>
                                <span>{progress.toFixed(0)}%</span>
                              </div>

                              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    progress > 0
                                      ? "bg-gradient-to-r from-green-400 to-emerald-500"
                                      : "bg-slate-300"
                                  }`}
                                  style={{
                                    width: `${Math.min(progress, 100)}%`,
                                  }}
                                />
                              </div>

                              {progress >= 90 && (
                                <div className="flex items-center gap-1 text-emerald-600 text-xs">
                                  <CheckCircle className="h-3 w-3" />
                                  <span>Almost Complete</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content - Video Player */}
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
                    <span>{formatTime(duration)}</span>
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
                    onVolumeChange={(e) => setVolume(e.target.volume)}
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
                        {progressPercent.toFixed(1)}% Complete
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                      <span>{formatTime(currentTime)}</span>
                      <span>
                        {watchedSeconds.size} / {duration} seconds watched
                      </span>
                      <span>{formatTime(duration)}</span>
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

                    <button
                      onClick={resetProgress}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset Progress
                    </button>
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
                      <div className="grid gap-2  overflow-y-auto custom-scrollbar">
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
        </div>
      </div>
    </div>
  );
};

export default WatchedVideo;
