import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import postsReducer from "./slices/postSlice";
import userReducer from "./slices/user";

const rootReducer = {
  auth: authReducer,
  posts: postsReducer,
  users: userReducer,
};

export default combineReducers(rootReducer);
