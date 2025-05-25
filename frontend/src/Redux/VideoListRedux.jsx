import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videoProgressMap: {},
  duration: 0,
  currentTime: 0,
  isPlaying: false,
  videoList: null,
  selectedVideo: null,
};

const videoProgresSlice = createSlice({
  name: "videoProgress",
  initialState: initialState,
  reducers: {
    setVideoProgressMap: (state, action) => {
      state.videoProgressMap = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
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
      const { videoId, currentSecond, currentTime } = action.payload;
      if (!state.videoProgressMap[videoId]) {
        state.videoProgressMap[videoId] = { watched: [], currentTime: 0 };
      }

      const watchedArray = state.videoProgressMap[videoId].watched || [];
      if (!watchedArray.includes(currentSecond)) {
        state.videoProgressMap[videoId] = {
          ...state.videoProgressMap[videoId],
          watched: [...watchedArray, currentSecond],
          currentTime: currentTime,
        };
      } else {
        state.videoProgressMap[videoId].currentTime = currentTime;
      }
    },
  },
});

export const videoProgressReducer = videoProgresSlice.reducer;

export const {
  setVideoProgressMap,
  setDuration,
  setCurrentTime,
  setIsPlaying,
  setVideoList,
  setSelectedVideo,
  resetProgress,
  updateVideoProgress,
} = videoProgresSlice.actions;

export const videoProgressSelector = (state) => state.videoProgressReducer;
