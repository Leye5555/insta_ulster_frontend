"use client";

import { CommentData, CommentsResType } from "@/lib/definitions/types.d";
import {
  createComment,
  deleteComment,
  updateComment,
} from "@/services/redux/slices/commentsSlice";

import { fetchUser } from "@/services/redux/slices/user";
import { useAppDispatch, useAppSelector } from "@/services/redux/store";
import React, { useEffect } from "react";
import { CommentSection } from "react-comments-section";
import Cookies from "universal-cookie";

const cookies = new Cookies(null, { path: "/" });
export type CombinedCommentType = CommentData &
  CommentsResType & {
    replies: CombinedCommentType[];
  };
const Comments = ({
  comments,
  isCollapsed,
  setIsCollapsed,
  likes,
  postId,
  commentCount,
}: {
  postId: string;
  commentCount?: number;
  comments: CombinedCommentType[] | undefined;
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  likes?: number;
}) => {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.users);
  const [isMounted, setIsMounted] = React.useState(false);

  //   const [inMemoryComments, setInMemoryComments] = React.useState<
  //     CombinedCommentType[] | undefined
  //   >(comments);

  useEffect(() => {
    setIsMounted(true);
    if (!userState.user?.username) {
      dispatch(fetchUser(cookies.get("AUTH")));
    }
  }, [userState.user?.username, dispatch]);

  const onSubmitAction = async (data: CommentData | CombinedCommentType) => {
    console.log(data);
    // setInMemoryComments((prev) => [
    //   data as CombinedCommentType,
    //   ...(prev as CombinedCommentType[]),
    // ]);

    if ((comments as CombinedCommentType[])?.length >= 1) {
      setIsCollapsed(false);
    }

    // dispatch to backend

    dispatch(createComment({ text: data.text, postId, commentID: null }));
  };

  const onReplyAction = async (data: CommentData) => {
    console.log(data);
    dispatch(
      createComment({
        text: data.text,
        postId,
        commentID: data.repliedToCommentId,
      })
    );
  };

  const onEditComment = async (data: CommentData) => {
    console.log(data);
    dispatch(updateComment({ text: data.text, commentId: data.comId }));
  };

  const onDeleteComment = async (data: CommentData) => {
    console.log(data);
    dispatch(deleteComment({ commentId: data.comIdToDelete as string }));
  };
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-semibold text-gray-500">
          {comments?.length === 0 ? commentCount : comments?.length} Comments
        </h1>
        <span className="text-sm font-semibold text-gray-500">
          {likes} Likes
        </span>
      </div>
      {isMounted && (
        <CommentSection
          overlayStyle={{
            overflow: isCollapsed ? "hidden" : "auto",
            maxHeight: isCollapsed ? "0px" : "max-content",
            display: isCollapsed ? "none" : "block",
            transition: "max-height 1s ease-in-out, display 2s ease-in-out",
          }}
          currentUser={{
            currentUserId: userState.user?._id,
            currentUserImg: `https://ui-avatars.com/api/?name=${
              userState.user?.username ?? "username"
            }&background=random`,
            currentUserProfile: `https://ui-avatars.com/api/?name=${
              userState.user?.username ?? "username"
            }&background=random`,
            currentUserFullName: userState.user?.username ?? "username",
          }}
          commentData={
            (isCollapsed
              ? (comments as CombinedCommentType[])?.slice(0, 1)
              : (comments as CombinedCommentType[])
            ).map((comment) => ({
              ...comment,
              userId: comment.userId,
              comId: comment._id,
              postId: comment.postId,
              fullName: comment.username,
              userProfile: `https://ui-avatars.com/api/?name=${comment.username}`,
              text: comment.text,
              avatarUrl: `https://ui-avatars.com/api/?name=${comment.username}`,
              timestamp: comment.createdAt,
              replies:
                (comment.replies as CombinedCommentType[]).map((rep) => ({
                  ...rep,
                  userId: rep.userId,
                  comId: rep._id,
                  postId: rep.postId,
                  fullName: rep.username,
                  userProfile: `https://ui-avatars.com/api/?name=${rep.username}`,
                  text: rep.text,
                  avatarUrl: `https://ui-avatars.com/api/?name=${rep.username}`,
                  timestamp: rep.createdAt,
                  replies: rep.replies || [],
                  parentOfRepliedCommentId: rep.commentID,
                  repliedToCommentId: rep.repliedToCommentId,
                  isEdited: rep.isEdited,
                  comIdToDelete: rep.comIdToDelete,
                })) ?? [],
              parentOfRepliedCommentId: comment.commentID,
              repliedToCommentId: comment.repliedToCommentId,
              isEdited: comment.isEdited,
              comIdToDelete: comment.comIdToDelete,
            })) ?? []
          }
          onSubmitAction={(data: unknown) =>
            onSubmitAction(data as CommentData)
          }
          onReplyAction={(data: unknown) => onReplyAction(data as CommentData)}
          onDeleteAction={(data: unknown) =>
            onDeleteComment(data as CommentData)
          }
          onEditAction={(data: unknown) => onEditComment(data as CommentData)}
          customNoComment={() => null}
          logIn={{
            onLogin: () => alert("Call login function "),
            signUpLink: "http://localhost:3000/register",
          }}
          placeHolder="Write your comment..."
        />
      )}
      {isCollapsed && (comments as CommentData[])?.length >= 1 && (
        <button
          className="text-xs float-right text-blue-500 cursor-pointer"
          onClick={() => setIsCollapsed(false)}
        >
          View all {comments?.length} comments
        </button>
      )}
      {!isCollapsed && (
        <button
          className="text-blue-500 text-xs cursor-pointer float-right"
          onClick={() => setIsCollapsed(true)}
        >
          Collapse
        </button>
      )}
    </>
  );
};

export default Comments;
