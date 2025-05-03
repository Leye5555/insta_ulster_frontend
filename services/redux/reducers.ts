import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import postsReducer from "./slices/postSlice";
import userReducer from "./slices/user";
import commentsReducer from "./slices/commentsSlice";
import likesReducer from "./slices/likesSlice";
const rootReducer = {
  auth: authReducer,
  posts: postsReducer,
  users: userReducer,
  comments: commentsReducer,
  likes: likesReducer,
};

export default combineReducers(rootReducer);
