import { CommentsResType } from "@/lib/definitions/types.d";
import { CommentData } from "@/lib/definitions/types.d";
import axios from "axios";
import Cookies from "universal-cookie";
import queryString from "query-string";

const cookies = new Cookies(null, { path: "/" });

const API_URL =
  process.env.NEXT_PUBLIC_APP_API_COMMENTS || "http://localhost:8002";
export async function getComments(postId: string) {
  try {
    const token = cookies.get("AUTH") ?? "";
    const query = queryString.stringify({
      postId,
    });
    console.log({ query });

    const res = await axios.get(`${API_URL}/v1/comments?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const { data } = res;
    const formattedComments = data?.map((comment: CommentsResType) => {
      const {
        userId,
        commentID,
        username,
        avatarUrl,
        userProfile,
        text,
        replies,
        createdAt,
      } = comment;

      let formattedReplies: CommentData[] = [];
      if (replies?.length) {
        formattedReplies = replies.map((reply: CommentsResType) => {
          return {
            userId: reply.userId,
            comId: reply.commentID,
            fullName: reply.username,
            userProfile: reply.userProfile,
            text: reply.text,
            avatarUrl: reply.avatarUrl,
            timestamp: reply.createdAt,
            replies: [],
            postId: reply.postId,
          };
        });
      }
      return {
        userId,
        comId: commentID,
        fullName: username,
        userProfile,
        text,
        avatarUrl,
        timestamp: createdAt,
        replies: formattedReplies,
      };
    });

    return formattedComments;
  } catch (error) {
    console.log({ error });
    return null;
  }
}

export async function addComment(payload: {
  text: string;
  postId: string;
  comment_id: string;
  parent_id?: string;
}) {
  try {
    const token = cookies.get("AUTH") ?? "";

    const res = await axios.post(
      `${API_URL}/v1/comments`,
      {
        text: payload.text,
        postId: payload.postId,
        comment_id: payload.comment_id,
        parent_id: payload.parent_id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const { data } = res;

    return data;
  } catch (error) {
    console.log({ error });
    return null;
  }
}

export async function editComment(payload: {
  text: string;
  comment_id: string;
}) {
  try {
    const token = cookies.get("AUTH") ?? "";

    const res = await axios.put(
      `${API_URL}/v1/comments`,
      {
        text: payload.text,
        comment_id: payload.comment_id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const { data } = res;
    return data;
  } catch (error) {
    console.log({ error });
    return null;
  }
}

export async function deleteComment(payload: { comment_id: string }) {
  try {
    const token = cookies.get("AUTH") ?? "";

    const res = await axios.delete(
      `${API_URL}/v1/comments/${payload.comment_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const { data } = res;
    return data;
  } catch (error) {
    console.log({ error });
    return null;
  }
}
