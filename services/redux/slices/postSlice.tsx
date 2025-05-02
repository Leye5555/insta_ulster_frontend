import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_APP_API || "http://localhost:5000";

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
  async ({ content, token }: { content: string; token: string }) => {
    const response = await axios.post(
      `${API_URL}/v1/posts`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [] as Array<{ id: string; content: string }>, // Replace with the actual post structure
    status: "idle",
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.error = action.error.message || null;
        state.status = "failed";
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      });
  },
});

export default postsSlice.reducer;
