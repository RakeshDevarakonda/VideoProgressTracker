import { useEffect, useRef, useState } from "react";

function secondsToIntervals(secondsSet) {
  if (!secondsSet) return;
  if (secondsSet.size === 0) return [];

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
  const videoRef = useRef(null);
  const getStorageKeySeconds = (id) => `watchedSeconds_${id}`;
  const getStorageKeyTime = (id) => `videoCurrentTime_${id}`;
  const defaultVideos = [
    {
      id: "1",
      url: "/Thor_Arrives_In_Wakanda_Scene_-_Avengers_Infinity_War__2018__Movie_CLIP_4K_ULTRA_HD(2160p).webm",
      name: "Wakanda Thor Video",
    },
  ];
  const [videoList, setVideoList] = useState(null);
  const [selectedVideo, setselectedVideo] = useState(null);

  const [customUrl, setCustomUrl] = useState("");

  const [watchedSeconds, setWatchedSeconds] = useState(null);

  const [currentTime, setCurrentTime] = useState(null);

  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const addCustomVideo = () => {
    if (!customUrl.trim()) return;

    const newId = `custom-${Date.now()}`;
    const fileName = customUrl.split("/").pop() || customUrl;
    const displayName =
      fileName.length > 30 ? fileName.substring(0, 30) + "..." : fileName;

    const newVideo = {
      id: newId,
      name: displayName || "hello",
      url: customUrl.trim(),
    };

    setVideoList((prev) => [...prev, newVideo]);
    setCustomUrl("");

    const updatedList = [...videoList, newVideo];

    localStorage.setItem("videoList", JSON.stringify(updatedList));
  };

  useEffect(() => {
    const storedVideoList = localStorage.getItem("videoList");
    const storedSelectedVideo = localStorage.getItem("selectedVideo");

    const parsedVideoList = storedVideoList
      ? JSON.parse(storedVideoList)
      : defaultVideos;

    const parsedSelectedVideo = storedSelectedVideo
      ? JSON.parse(storedSelectedVideo)
      : defaultVideos[0];

    setVideoList(parsedVideoList);
    setselectedVideo(parsedSelectedVideo);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !selectedVideo?.id) return;

    const handleLoadedMetadata = () => {
      setDuration(Math.floor(video.duration));
    };

    const savedTime = localStorage.getItem(getStorageKeyTime(selectedVideo.id));
    if (savedTime) {
      video.currentTime = parseFloat(savedTime);
    }

    const handleTimeUpdate = () => {
      const currentSecond = Math.floor(video.currentTime);
      setCurrentTime(video.currentTime);

      setWatchedSeconds((prev) => {
        if (prev.has(currentSecond)) return prev;
        const newSet = new Set(prev);
        newSet.add(currentSecond);
        return newSet;
      });
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [videoRef, selectedVideo]); // Dependencies include videoRef and selectedVideo

  useEffect(() => {
    if (!selectedVideo?.id || !watchedSeconds) return;

    localStorage.setItem(
      getStorageKeySeconds(selectedVideo.id),
      JSON.stringify(Array.from(watchedSeconds))
    );
  }, [watchedSeconds]);

  useEffect(() => {
    if (!selectedVideo?.id || !currentTime) return;
    localStorage.setItem(
      getStorageKeyTime(selectedVideo.id),
      currentTime.toString()
    );
  }, [currentTime]);

  useEffect(() => {
    if (!selectedVideo?.id) return;
    try {
      const savedSeconds = localStorage.getItem(
        getStorageKeySeconds(selectedVideo?.id)
      );
      const parsedSeconds = savedSeconds
        ? new Set(JSON.parse(savedSeconds))
        : new Set();
      setWatchedSeconds(parsedSeconds);
      console.log(JSON.parse(savedSeconds));
    } catch {
      setWatchedSeconds(new Set());
    }

    try {
      const savedTime = localStorage.getItem(
        getStorageKeyTime(selectedVideo?.id)
      );
      console.log(parseFloat(savedTime));
      setCurrentTime(savedTime ? parseFloat(savedTime) : 0);
    } catch {
      setCurrentTime(0);
    }
  }, [selectedVideo]);

  useEffect(() => {
    if (videoRef.current && duration > 0) {
      videoRef.current.currentTime = currentTime;
    }
  }, [duration]);

  const resetProgress = () => {
    setWatchedSeconds(new Set());
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
    localStorage.removeItem(getStorageKeySeconds(selectedVideo.id));
    localStorage.removeItem(getStorageKeyTime(selectedVideo.id));
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  let progressPercent = 0;

  if (
    watchedSeconds?.size === 1 &&
    watchedSeconds.values().next().value === 0
  ) {
    progressPercent = 0;
  } else {
    progressPercent =
      duration > 0 ? (watchedSeconds?.size / duration) * 100 : 0;
  }

  const intervals = secondsToIntervals(watchedSeconds);

  if (!selectedVideo?.id) return <div>loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Video Progress Tracker
      </h2>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Add Custom Video URL
        </h3>
        <div className="flex gap-2">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Enter video URL (e.g., https://example.com/video.mp4)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={addCustomVideo}
            disabled={!customUrl.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Add Video
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Select Video
        </h3>
        <div className="flex items-center gap-2">
          <select
            value={selectedVideo?.id}
            onChange={(e) => {
              const selected = videoList.find((f) => f.id === e.target.value);
              localStorage.setItem("selectedVideo", JSON.stringify(selected));
              setselectedVideo(selected);
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {videoList.map((video) => (
              <option key={video.id} value={video.id}>
                {video.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
        <video
          ref={videoRef}
          src={selectedVideo.url}
          controls
          className="w-full h-full object-contain"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={togglePlayPause}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {isPlaying ? (
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Pause
            </span>
          ) : (
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
              Play
            </span>
          )}
        </button>

        <div className="text-gray-700 font-medium">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-700">
            Watched: {progressPercent.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={resetProgress}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
        >
          Reset Progress
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h4 className="font-bold text-gray-800 mb-2">Watch Progress:</h4>
        <p className="text-sm text-gray-600 mb-1">
          Current Time: {currentTime?.toFixed(1)}s
        </p>
        <p className="text-sm text-gray-600 mb-1">
          Watched Seconds: {watchedSeconds?.size} / {duration} seconds
        </p>
        <p className="text-sm text-gray-600">
          Progress: {progressPercent.toFixed(2)}%
        </p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h4 className="font-bold text-gray-800 mb-2">Watched Intervals:</h4>
        {intervals?.length === 0 ? (
          <p className="text-gray-500 italic">No intervals watched yet</p>
        ) : (
          <div className="space-y-2">
            {intervals?.map(([start, end], index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white px-3 py-2 rounded-md shadow-sm border-l-4 border-blue-400"
              >
                <span className="font-mono text-sm text-gray-700">
                  {start === end ? `${start}s` : `${start}s - ${end}s`}
                </span>
                <span className="text-xs text-gray-500">
                  {start === end ? "1 sec" : `${end - start + 1} secs`}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchedVideo;
