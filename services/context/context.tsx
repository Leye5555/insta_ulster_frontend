"use client";
import React, { createContext, Dispatch, useReducer } from "react";
import {
  postsReducer,
  likesReducer,
  commentsReducer,
  bookmarksReducer,
} from "./reducers"; // import your reducers here
import { ActionTypes } from "./enums"; // your action types enum

// --- Types ---
export type PostType = {
  id: string;
  userId: string;
  content: string;
  mediaUrl?: string;
  createdAt: string;
  username: string;
  verified?: boolean;
  likes?: number;
  caption?: string;
  commentCount?: number;
};

export type LikeType = {
  postId: string;
  userId: string;
};

export type CommentType = {
  id: string;
  postId: string;
  userId: string;
  text: string;
  createdAt: string;
};

export type BookmarkType = {
  postId: string;
  userId: string;
};

// --- State Types ---
export type PostsStateType = { posts: PostType[] };
export type LikesStateType = { likes: LikeType[] };
export type CommentsStateType = { comments: CommentType[] };
export type BookmarksStateType = { bookmarks: BookmarkType[] };

export type InitialStateType = {
  posts_state: PostsStateType;
  likes_state: LikesStateType;
  comments_state: CommentsStateType;
  bookmarks_state: BookmarksStateType;
};

// --- Initial State ---
export const initialState: InitialStateType = {
  posts_state: { posts: [] },
  likes_state: { likes: [] },
  comments_state: { comments: [] },
  bookmarks_state: { bookmarks: [] },
};

// --- Action Types ---
export type PostsActionType =
  | { type: ActionTypes.ADD_POST; payload: PostType }
  | { type: ActionTypes.REMOVE_POST; payload: string }
  | { type: ActionTypes.UPDATE_POST; payload: PostType };

export type LikesActionType =
  | { type: ActionTypes.ADD_LIKE; payload: LikeType }
  | { type: ActionTypes.REMOVE_LIKE; payload: LikeType };

export type CommentsActionType =
  | { type: ActionTypes.ADD_COMMENT; payload: CommentType }
  | { type: ActionTypes.REMOVE_COMMENT; payload: string }
  | { type: ActionTypes.UPDATE_COMMENT; payload: CommentType };

export type BookmarksActionType =
  | { type: ActionTypes.ADD_BOOKMARK; payload: BookmarkType }
  | { type: ActionTypes.REMOVE_BOOKMARK; payload: BookmarkType };

export type ContextActionType =
  | PostsActionType
  | LikesActionType
  | CommentsActionType
  | BookmarksActionType;

// --- Combined Reducer ---
const combinedReducer = (
  state: InitialStateType,
  action: ContextActionType
): InitialStateType => ({
  posts_state: postsReducer(state.posts_state, action as PostsActionType),
  likes_state: likesReducer(state.likes_state, action as LikesActionType),
  comments_state: commentsReducer(
    state.comments_state,
    action as CommentsActionType
  ),
  bookmarks_state: bookmarksReducer(
    state.bookmarks_state,
    action as BookmarksActionType
  ),
});

// --- Context ---
export const GlobalContext = createContext<{
  state: InitialStateType;
  dispatch: Dispatch<ContextActionType>;
}>({
  state: initialState,
  dispatch: () => null,
});

// --- Provider ---
export const GlobalContextProvider = ({
  children,
}: React.PropsWithChildren) => {
  const [state, dispatch] = useReducer(combinedReducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};
