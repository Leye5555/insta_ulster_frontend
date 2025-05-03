import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
import axios from "axios";
import { CommentsResType } from "@/lib/definitions/types.d";
import { CombinedCommentType } from "@/components/Comments";

const cookies = new Cookies(null, { path: "/" });
const API_URL =
  process.env.NEXT_PUBLIC_API_URL_COMMENTS || "http://localhost:8002/v1";

// Async thunks

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async ({ postId }: { postId: string }, thunkAPI) => {
    try {
      const token = cookies.get("AUTH");
      const res = await axios.get(`${API_URL}/comments/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.comments;
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

export const createComment = createAsyncThunk(
  "comments/createComment",
  async (
    {
      postId,
      text,
      commentID,
    }: { postId: string; text: string; commentID?: string | null },
    thunkAPI
  ) => {
    try {
      const token = cookies.get("AUTH");
      const res = await axios.post(
        `${API_URL}/comments/${postId}`,
        { text, commentID },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
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

export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async (
    { commentId, text }: { commentId: string; text: string },
    thunkAPI
  ) => {
    try {
      const token = cookies.get("AUTH");
      const res = await axios.put(
        `${API_URL}/comments/${commentId}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
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

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async ({ commentId }: { commentId: string }, thunkAPI) => {
    try {
      const token = cookies.get("AUTH");
      const res = await axios.delete(`${API_URL}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
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

// Slice
const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    commentsObject: {} as { [key: string]: CombinedCommentType[] },
    status: "idle" as "idle" | "loading" | "succeeded" | "failed",
    error: null as string | null,
  },
  reducers: {
    clearComments: (state) => {
      state.commentsObject = {};
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Comments
      .addCase(fetchComments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.commentsObject = {
          ...state.commentsObject,
          [action.meta.arg.postId]: action.payload,
        };
        state.status = "succeeded";
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = "failed";
      })
      // Create Comment
      .addCase(createComment.fulfilled, (state, action) => {
        // For top-level comments, push to root; for replies, update recursively
        const comment = action.payload;
        console.log("Comment created:", comment);
        const comments = state.commentsObject[comment?.postId] || [];
        if (!comment.commentID) {
          comments.unshift(comment);
        } else {
          // Helper to insert reply into the correct parent
          const insertReply = (comments: CommentsResType[]): boolean => {
            for (const c of comments) {
              if (c._id === comment.commentID) {
                c.replies = c.replies || [];
                c.replies.push(comment);
                return true;
              }
              if (c.replies && insertReply(c.replies)) return true;
            }
            return false;
          };
          insertReply(comments);
        }
        state.status = "succeeded";
      })
      .addCase(createComment.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = "failed";
      })
      // Update Comment
      .addCase(updateComment.fulfilled, (state, action) => {
        const updated = action.payload;
        const comments = state.commentsObject[updated.postId] || [];
        const updateRecursively = (comments: CommentsResType[]) => {
          for (let i = 0; i < comments.length; i++) {
            if (comments[i]._id === updated._id) {
              comments[i] = { ...comments[i], ...updated };
              return true;
            }
            if (comments[i].replies && updateRecursively(comments[i].replies))
              return true;
          }
          return false;
        };
        updateRecursively(comments);
        state.status = "succeeded";
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = "failed";
      })
      // Delete Comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const deleted = action.payload;
        const comments = state.commentsObject[deleted.postId] || [];

        const removeRecursively = (comments: CommentsResType[]): boolean => {
          const idx = comments.findIndex((c) => c._id === deleted._id);
          if (idx !== -1) {
            comments.splice(idx, 1);
            return true;
          }
          for (const c of comments) {
            if (c.replies && removeRecursively(c.replies)) return true;
          }
          return false;
        };
        removeRecursively(comments);
        state.status = "succeeded";
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.error = action.payload as string;
        state.status = "failed";
      });
  },
});

export const { clearComments } = commentsSlice.actions;
export default commentsSlice.reducer;
