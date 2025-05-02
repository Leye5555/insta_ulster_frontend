import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import postsReducer from "./slices/postSlice";

const rootReducer = {
  auth: authReducer,
  posts: postsReducer,
};

export default combineReducers(rootReducer);
