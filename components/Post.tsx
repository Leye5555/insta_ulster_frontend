"use client";
import { GlobalContext } from "@/services/context/context";
import { ActionTypes } from "@/services/context/enums";
import Image from "next/image";
import { useContext } from "react";

// Post Component
const Post = ({
  userId,
  username,
  verified = false,
  timeAgo,
  likes,
  caption,
  commentCount,
  mediaUrl,
  postId,
}: {
  userId: string;
  username: string;
  verified?: boolean;
  timeAgo?: string;
  likes?: number;
  caption?: string;
  commentCount?: number;
  mediaUrl?: string;
  postId?: string;
}) => {
  const { state, dispatch } = useContext(GlobalContext);

  const handleLike = (postId: string) => {
    // Example: add a like from user 'user123'

    const isLiked = state.likes_state.likes.some(
      (item) => item.userId === userId
    );
    if (isLiked)
      dispatch({
        type: ActionTypes.REMOVE_LIKE,
        payload: { postId, userId },
      });
    else
      dispatch({
        type: ActionTypes.ADD_LIKE,
        payload: { postId, userId },
      });
  };

  return (
    <div className="border-b border-gray-200">
      {/* Post Header */}
      <div className="flex justify-between items-center p-3">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
          <div className="flex items-center">
            <span className="font-semibold text-sm">{username}</span>
            {verified && <span className="text-blue-500 ml-1">•</span>}
            <span className="mx-1 text-gray-500">•</span>
            <span className="text-gray-500 text-sm">{timeAgo}</span>
          </div>
        </div>
        <div className="text-xl">...</div>
      </div>
      {/* Post Image/Video */}
      <div className="bg-black aspect-square w-full flex items-center justify-center">
        {/* Placeholder for media */}
        <div className="w-full h-full bg-gray-700">
          {mediaUrl && (
            <Image
              fill
              src={mediaUrl}
              width={500}
              height={500}
              alt="Post"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>
      {/* Post Actions */}
      <div className="p-3">
        <div className="flex justify-between mb-2">
          <div className="flex space-x-4">
            <button onClick={() => handleLike(postId as string)}>❤️</button>
            <button>💬</button>
            <button>📤</button>
          </div>
          <span>🔖</span>
        </div>
        {!!likes && (
          <div className="text-sm font-semibold">
            {likes.toLocaleString()} likes
          </div>
        )}
        {caption && (
          <div className="mt-1 text-sm">
            <span className="font-semibold">{username}</span>
            <span className="ml-1">{caption}</span>
          </div>
        )}
        {commentCount && (
          <div className="mt-1 text-gray-500 text-sm">
            View all {commentCount} comments
          </div>
        )}
        <div className="mt-2 text-gray-400 text-sm">Add a comment...</div>
      </div>
    </div>
  );
};

export default Post;
