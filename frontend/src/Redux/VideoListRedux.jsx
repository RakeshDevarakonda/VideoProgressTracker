import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videoList: [],
  selectedVideo: null,
};

const videoProgresSlice = createSlice({
  name: "videoProgress",
  initialState: initialState,
  reducers: {
    setVideoList: (state, action) => {
      state.videoList = action.payload;
    },
    setSelectedVideo: (state, action) => {
      state.selectedVideo = action.payload;
    },
  },
});

export const videoProgressReducer = videoProgresSlice.reducer;

export const { setVideoList,setSelectedVideo } = videoProgresSlice.actions;

export const videoProgressSelector = (state) => state.videoProgressReducer;
