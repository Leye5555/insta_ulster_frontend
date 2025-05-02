import { CommentType, LikeType } from "@/services/context/context";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies(null, { path: "/" });

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
    posts_meta: {
      posts: [
        {
          _id: "string",
          content: "string",
          img_url:
            "https://images.unsplash.com/photo-1726137065566-153debe32a53?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          createdAt: "2025-10-01T00:00:00.000Z",
          updatedAt: "2025-10-01T04:00:00.000Z",
          userId: "string",
          tags: ["string"],
          comments: [] as CommentType[],
          likes: [] as LikeType[],
          dislikes: [] as LikeType[],
          shares: ["string"],
          views: ["string"],
          reports: ["string"],
          saved: ["string"],
          user: {
            _id: "string",
            username: "string",
            email: "string",
            role: "string",
            createdAt: "string",
            updatedAt: "string",
          },
        },
      ],
      sas_token: "string",
    },
    status: "idle",
    error: null as string | null,
  },
  reducers: {
    reset: (state) => {
      state.status = "idle";
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
      });
  },
});

export const { reset } = postsSlice.actions;
export default postsSlice.reducer;
