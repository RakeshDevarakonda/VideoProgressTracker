import { Video, CheckCircle } from "lucide-react";
import {
  setSelectedVideo,
  videoProgressSelector,
} from "../Redux/VideoListRedux";
import { useDispatch, useSelector } from "react-redux";

const VideoList = () => {
  const dispatch = useDispatch();
  const { videoList, selectedVideo, videoProgressMap } = useSelector(
    videoProgressSelector
  );

  const duration = videoProgressMap[selectedVideo?._id]?.duration;

  const getVideoProgress = (id) => {
    const watchedArray = videoProgressMap[id]?.watched || [];
    const filteredWatched = watchedArray.filter((second) => second !== 0);
    const videoDuration = videoProgressMap[id]?.duration || duration;

    return videoDuration > 0
      ? (filteredWatched.length / Math.floor(videoDuration)) * 100
      : 0;
  };

  if (!selectedVideo) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-50"></div>
      </div>
    );
  }

  return (
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
            {videoList?.map((video, index) => {
              const progress = getVideoProgress(video._id);
              const isActive = selectedVideo?._id === video._id;

              return (
                <div
                  key={video._id}
                  onClick={() => dispatch(setSelectedVideo(video))}
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
                        {video.title || video.name || `Video ${index + 1}`}
                      </h4>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>Progress</span>
                          <span>{Math.min(Math.round(progress), 100)}%</span>
                        </div>

                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              progress > 0
                                ? "bg-gradient-to-r from-green-400 to-emerald-500"
                                : "bg-slate-300"
                            }`}
                            style={{
                              width: `${Math.min(Math.round(progress), 100)}%`,
                            }}
                          />
                        </div>

                        {Math.round(progress) >= 100 ? (
                          <div className="flex items-center gap-1 text-emerald-600 text-xs">
                            <CheckCircle className="h-3 w-3" />
                            <span>Completed</span>
                          </div>
                        ) : Math.round(progress) >= 80 ? (
                          <div className="flex items-center gap-1 text-amber-500 text-xs">
                            <CheckCircle className="h-3 w-3" />
                            <span>Almost Complete</span>
                          </div>
                        ) : Math.round(progress) >= 40 ? (
                          <div className="flex items-center gap-1 text-yellow-500 text-xs">
                            <CheckCircle className="h-3 w-3" />
                            <span>Halfway There</span>
                          </div>
                        ) : Math.round(progress) > 0 ? (
                          <div className="flex items-center gap-1 text-gray-500 text-xs">
                            <CheckCircle className="h-3 w-3" />
                            <span>Just Started</span>
                          </div>
                        ) : null}
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
  );
};

export default VideoList;
