import {
  BookmarksStateType,
  BookmarkType,
  CommentsStateType,
  CommentType,
  LikesStateType,
  LikeType,
  PostsStateType,
  PostType,
} from "./context";
import { ActionTypes } from "./enums";

type ActionMap<T extends { [key: string]: unknown }> = {
  [Key in keyof T]: T[Key] extends undefined
    ? { type: Key }
    : { type: Key; payload: T[Key] };
};

// Posts payloads
type PostsPayload = {
  [ActionTypes.ADD_POST]: PostType;
  [ActionTypes.REMOVE_POST]: string; // postId
  [ActionTypes.UPDATE_POST]: PostType;
};

// Likes payloads
type LikesPayload = {
  [ActionTypes.ADD_LIKE]: LikeType;
  [ActionTypes.REMOVE_LIKE]: LikeType;
};

// Comments payloads
type CommentsPayload = {
  [ActionTypes.ADD_COMMENT]: CommentType;
  [ActionTypes.REMOVE_COMMENT]: string; // commentId
  [ActionTypes.UPDATE_COMMENT]: CommentType;
};

// Bookmarks payloads
type BookmarksPayload = {
  [ActionTypes.ADD_BOOKMARK]: BookmarkType;
  [ActionTypes.REMOVE_BOOKMARK]: BookmarkType;
};

export type PostsActionType =
  ActionMap<PostsPayload>[keyof ActionMap<PostsPayload>];
export type LikesActionType =
  ActionMap<LikesPayload>[keyof ActionMap<LikesPayload>];
export type CommentsActionType =
  ActionMap<CommentsPayload>[keyof ActionMap<CommentsPayload>];
export type BookmarksActionType =
  ActionMap<BookmarksPayload>[keyof ActionMap<BookmarksPayload>];

// post reducers

export const postsReducer = (
  state: PostsStateType,
  action: PostsActionType
): PostsStateType => {
  switch (action.type) {
    case ActionTypes.ADD_POST:
      return { ...state, posts: [action.payload, ...state.posts] };
    case ActionTypes.REMOVE_POST:
      return {
        ...state,
        posts: state.posts.filter((post) => post.id !== action.payload),
      };
    case ActionTypes.UPDATE_POST:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.id ? action.payload : post
        ),
      };
    default:
      return state;
  }
};

// like reducers

export const likesReducer = (
  state: LikesStateType,
  action: LikesActionType
): LikesStateType => {
  switch (action.type) {
    case ActionTypes.ADD_LIKE:
      return { ...state, likes: [...state.likes, action.payload] };
    case ActionTypes.REMOVE_LIKE:
      return {
        ...state,
        likes: state.likes.filter(
          (like) =>
            !(
              like.postId === action.payload.postId &&
              like.userId === action.payload.userId
            )
        ),
      };
    default:
      return state;
  }
};

// comments reducers

export const commentsReducer = (
  state: CommentsStateType,
  action: CommentsActionType
): CommentsStateType => {
  switch (action.type) {
    case ActionTypes.ADD_COMMENT:
      return { ...state, comments: [...state.comments, action.payload] };
    case ActionTypes.REMOVE_COMMENT:
      return {
        ...state,
        comments: state.comments.filter(
          (comment) => comment.id !== action.payload
        ),
      };
    case ActionTypes.UPDATE_COMMENT:
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment.id === action.payload.id ? action.payload : comment
        ),
      };
    default:
      return state;
  }
};

// bookmarks reducers

export const bookmarksReducer = (
  state: BookmarksStateType,
  action: BookmarksActionType
): BookmarksStateType => {
  switch (action.type) {
    case ActionTypes.ADD_BOOKMARK:
      return { ...state, bookmarks: [...state.bookmarks, action.payload] };
    case ActionTypes.REMOVE_BOOKMARK:
      return {
        ...state,
        bookmarks: state.bookmarks.filter(
          (bookmark) =>
            !(
              bookmark.postId === action.payload.postId &&
              bookmark.userId === action.payload.userId
            )
        ),
      };
    default:
      return state;
  }
};

export type InitialStateType = {
  posts_state: PostsStateType;
  likes_state: LikesStateType;
  comments_state: CommentsStateType;
  bookmarks_state: BookmarksStateType;
};

export const initialState: InitialStateType = {
  posts_state: { posts: [] },
  likes_state: { likes: [] },
  comments_state: { comments: [] },
  bookmarks_state: { bookmarks: [] },
};

export type ContextActionType =
  | PostsActionType
  | LikesActionType
  | CommentsActionType
  | BookmarksActionType;

export const combinedReducer = (
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
