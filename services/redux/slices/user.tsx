import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_APP_API || "http://localhost:8000";

export const fetchUsers = createAsyncThunk(
  "posts/fetchUsers",
  async (token) => {
    const response = await axios.get(`${API_URL}/v1/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

export const fetchUser = createAsyncThunk(
  "posts/fetchUser",
  async ({ id, token }: { token: string; id: string }) => {
    const response = await axios.get(`${API_URL}/v1/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [] as Array<{ _id: string; username: string; email?: string }>, // Replace with the actual post structure
    user: {} as { _id: string; username: string; email?: string },
    status: "idle",
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        console.log(action.payload);
        state.users = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.error?.message || null;
        state.status = "failed";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.error?.message || null;
        state.status = "failed";
      });
  },
});

export default usersSlice.reducer;
