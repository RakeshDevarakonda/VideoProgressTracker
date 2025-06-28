import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videoProgressMap: {},
  isPlaying: false,
  videoList: null,
  selectedVideo: null,
  userId: null,
};

const videoProgresSlice = createSlice({
  name: "videoProgress",
  initialState: initialState,
  reducers: {
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },

    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setVideoList: (state, action) => {
      state.videoList = action.payload;
    },
    setSelectedVideo: (state, action) => {
      state.selectedVideo = action.payload;
    },
    resetProgress: (state, action) => {
      const videoId = action.payload;
      state.videoProgressMap[videoId] = { watched: [], currentTime: 0 };
      state.currentTime = 0;
    },
    updateVideoProgress: (state, action) => {
      const { videoId, currentSecond, currentTime, duration } = action.payload;

      if (!state.videoProgressMap[videoId]) {
        state.videoProgressMap[videoId] = {
          watched: [],
          currentTime: 0,
          duration: 0,
        };
      }

      const watchedArray = state.videoProgressMap[videoId].watched || [];

      if (!watchedArray.includes(currentSecond)) {
        state.videoProgressMap[videoId] = {
          ...state.videoProgressMap[videoId],
          watched: [...watchedArray, currentSecond],
          currentTime,
          duration: duration ?? state.videoProgressMap[videoId].duration,
        };
      } else {
        state.videoProgressMap[videoId].currentTime = currentTime;
        state.videoProgressMap[videoId].duration =
          duration ?? state.videoProgressMap[videoId].duration;
      }
    },

    setInitialVideoProgress: (state, action) => {
      const videos = action.payload;

      videos.forEach((video) => {
        const videoId = video._id;

        if (!state.videoProgressMap[videoId]) {
          state.videoProgressMap[videoId] = {
            watched: video.watched || [],
            currentTime: video.currentTime || 0,
            duration: video.duration || 0,
          };
        }
      });
    },
  },
});

export const videoProgressReducer = videoProgresSlice.reducer;

export const {
  setInitialVideoProgress,
  setIsPlaying,
  setVideoList,
  setSelectedVideo,
  resetProgress,
  updateVideoProgress,
  setUserId,
} = videoProgresSlice.actions;

export const videoProgressSelector = (state) => state.videoProgressReducer;
