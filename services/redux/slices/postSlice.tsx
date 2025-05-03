import { CommentType } from "@/services/context/context";
import { LikeType } from "./likesSlice";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies(null, { path: "/" });
export type PostType = {
  _id: string;
  content: string;
  img_url: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  tags: string[];
  comments: CommentType[];
  likes: LikeType[];
  dislikes: LikeType[];
  shares: string[];
  views: string[];
  reports: string[];
  saved: string[];
  user: {
    _id: string;
    username: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
};
export type PostsMetaType = {
  posts: PostType[];
  sas_token: string;
};
export type PostsResType = {
  posts_meta: PostsMetaType;
  status: string;
  error: string | null;
};

const API_URL =
  process.env.NEXT_PUBLIC_APP_API_POSTS || "http://localhost:8001";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (token) => {
    const response = await axios.get(`${API_URL}/v1/posts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

// delete post

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async ({ postId, token }: { postId: string; token: string }) => {
    const response = await axios.delete(`${API_URL}/v1/posts/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);
// update post
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({
    postId,
    content,
    post_image,
    token,
  }: {
    postId: string;
    content: string;
    token: string;
    post_image: File;
  }) => {
    const formData = new FormData();
    formData.append("content", content);
    formData.append("post_image", post_image);

    const response = await axios.put(
      `${API_URL}/v1/posts/${postId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "multipart/form-data",
        },
      }
    );
    return response.data;
  }
);

export const fetchPostsLikedByUser = createAsyncThunk(
  "posts/fetchPostsLikedByUser",
  async (token) => {
    const response = await axios.get(`${API_URL}/v1/posts-liked`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async ({
    content,
    post_image,
    token,
  }: {
    content: string;
    token: string;
    post_image: File;
  }) => {
    const formData = new FormData();
    formData.append("content", content);
    formData.append("post_image", post_image);

    const response = await axios.post(`${API_URL}/v1/posts`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "multipart/form-data",
      },
    });
    return response.data;
  }
);

/**
 *  // single post
 * {
  "post": {
    "_id": "string",
    "content": "string",
    "img_url": "string",
    "createdAt": "string",
    "updatedAt": "string",
    "userId": "string",
    "tags": [
      "string"
    ],
    "comments": [
      "string"
    ],
    "likes": [
      "string"
    ],
    "dislikes": [
      "string"
    ],
    "shares": [
      "string"
    ],
    "views": [
      "string"
    ],
    "reports": [
      "string"
    ],
    "saved": [
      "string"
    ],
    "user": {
      "_id": "string",
      "username": "string",
      "email": "string",
      "role": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
}
 */

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts_meta: {} as PostsMetaType,
    status: "idle",
    error: null as string | null,
  },
  reducers: {
    reset: (state) => {
      state.status = "idle";
    },
    resetPosts: (state) => {
      state.posts_meta = {} as PostsMetaType;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.fulfilled, (state, action) => {
        console.log(action.payload);
        state.posts_meta = action.payload;
        state.status = "succeeded";
        cookies.set("AZURE_TOKEN", action.payload.sas_token);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.error = action.error?.message || null;
        state.status = "failed";
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts_meta.posts.unshift(action.payload);
        state.status = "succeeded";
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.error?.message || null;
        state.status = "failed";
      })
      .addCase(fetchPostsLikedByUser.fulfilled, (state, action) => {
        console.log(action.payload);
        state.posts_meta = action.payload;
        state.status = "succeeded";
        cookies.set("AZURE_TOKEN", action.payload.sas_token);
      })
      .addCase(fetchPostsLikedByUser.rejected, (state, action) => {
        state.error = action.error?.message || null;
        state.status = "failed";
      })
      // Add more cases for other actions like updatePost, deletePost, etc.

      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts_meta.posts = state.posts_meta.posts.filter(
          (post) => post._id !== action.payload._id
        );
        state.status = "succeeded";
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.error = action.error?.message || null;
        state.status = "failed";
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        state.posts_meta.posts = state.posts_meta.posts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        );
        state.status = "succeeded";
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.error = action.error?.message || null;
        state.status = "failed";
      });
  },
});

export const { reset, resetPosts } = postsSlice.actions;
export default postsSlice.reducer;
