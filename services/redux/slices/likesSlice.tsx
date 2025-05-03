import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
import axios from "axios";

const cookies = new Cookies(null, { path: "/" });
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8003";

// Types
export type LikeType = {
  _id?: string;
  userId: string;
  postId: string;
  username?: string;
  avatarUrl?: string;
  userProfile?: string;
  createdAt?: string;
  user?: {
    _id: string;
    username: string;
    avatarUrl: string;
    userProfile: string;
  };
};

// Fetch likes for a post
export const fetchLikes = createAsyncThunk(
  "likes/fetchLikes",
  async ({ postId }: { postId: string }, thunkAPI) => {
    try {
      const token = cookies.get("AUTH");
      const res = await axios.get(`${API_URL}/v1/likes/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { postId, likes: res.data.likes };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(
          error.response.data?.error || error.message
        );
      }
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

// Like a post
export const likePost = createAsyncThunk(
  "likes/likePost",
  async ({ postId }: { postId: string }, thunkAPI) => {
    try {
      const token = cookies.get("AUTH");
      const res = await axios.post(
        `${API_URL}/v1/likes/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { postId, likes: res.data.likes };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(
          error.response.data?.error || error.message
        );
      }
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

// Unlike a post
export const unlikePost = createAsyncThunk(
  "likes/unlikePost",
  async ({ postId }: { postId: string }, thunkAPI) => {
    try {
      const token = cookies.get("AUTH");
      const res = await axios.delete(`${API_URL}/v1/likes/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { postId, likes: res.data.likes };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(
          error.response.data?.error || error.message
        );
      }
      return thunkAPI.rejectWithValue("An unknown error occurred");
    }
  }
);

type LikesState = {
  likesByPost: Record<string, LikeType[]>;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: LikesState = {
  likesByPost: {},
  status: "idle",
  error: null,
};

const likesSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    clearLikes: (state) => {
      state.likesByPost = {};
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Likes
      .addCase(fetchLikes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLikes.fulfilled, (state, action) => {
        state.likesByPost[action.payload.postId] = action.payload.likes;
        state.status = "succeeded";
      })
      .addCase(fetchLikes.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = "failed";
      })
      // Like Post
      .addCase(likePost.fulfilled, (state, action) => {
        state.likesByPost[action.payload.postId] = action.payload.likes;
        state.status = "succeeded";
      })
      .addCase(likePost.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = "failed";
      })
      // Unlike Post
      .addCase(unlikePost.fulfilled, (state, action) => {
        state.likesByPost[action.payload.postId] = action.payload.likes;
        state.status = "succeeded";
      })
      .addCase(unlikePost.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = "failed";
      });
  },
});

export const { clearLikes } = likesSlice.actions;
export default likesSlice.reducer;
