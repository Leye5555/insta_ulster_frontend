import Cookies from "universal-cookie";
import AuthAPi from "@/_api/auth";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const cookies = new Cookies(null, { path: "/" });

export const login = createAsyncThunk(
  "auth/login",
  async (
    { username, password }: { username: string; password: string },
    thunkAPI
  ) => {
    try {
      const res = await AuthAPi.login({ username, password });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    {
      email,
      username,
      password,
      role,
    }: { email: string; username: string; password: string; role: string },
    thunkAPI
  ) => {
    try {
      const response = await AuthAPi.register({
        email,
        username,
        password,
        role,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    status: "idle",
    error: null as string | null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        cookies.set("AUTH", action.payload.token);
        state.status = "succeeded_login";
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.error.message ?? null;
        state.status = "failed";
      })
      .addCase(register.fulfilled, (state) => {
        state.status = "succeeded_register";
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.error.message ?? null;
        state.status = "failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
