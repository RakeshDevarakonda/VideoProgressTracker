import { configureStore } from "@reduxjs/toolkit";
import { videoProgressReducer } from "../Redux/VideoListRedux";

const reducer = {
  videoProgressReducer,
};

export const store = configureStore({
  reducer: reducer,
});
