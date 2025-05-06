"use client";
import { fetchComments } from "@/services/redux/slices/commentsSlice";
import {
  likePost,
  LikeType,
  unlikePost,
} from "@/services/redux/slices/likesSlice";
import { useAppDispatch, useAppSelector } from "@/services/redux/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import Comments from "./Comments";
import { Button } from "./ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";

const cookies = new Cookies(null, { path: "/" });

// Post Component
const Post = ({
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
  likes?: LikeType[];
  caption?: string;
  commentCount?: number;
  mediaUrl?: string;
  postId: string;
}) => {
  const reduxDispatch = useAppDispatch();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const commentsState = useAppSelector((state) => state.comments);
  const [likeCount, setLikeCount] = useState(likes?.length || 0);
  const [likeState, setLikeState] = useState(likes);
  const [isMounted, setIsMounted] = useState(false);
  const handleLike = (postId: string) => {
    console.log(likes);
    const [, token_sub] = cookies.get("AUTH").split(".");
    const user_meta = JSON.parse(atob(token_sub));

    if (likeState?.find((item) => item.userId === user_meta?.userId)) {
      setLikeCount((prev) => prev - 1);
      setLikeState((prev) =>
        prev?.filter((item) => item.userId !== user_meta?.userId)
      );
      reduxDispatch(unlikePost({ postId }));
    } else {
      setLikeCount((prev) => prev + 1);
      setLikeState((prev) => [
        ...(prev as LikeType[]),
        {
          postId,
          userId: user_meta?.userId,
        },
      ]);
      reduxDispatch(likePost({ postId }));
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, [setIsMounted]);
  const handleCommentClick = () => {
    setIsCollapsed(!isCollapsed);
    reduxDispatch(fetchComments({ postId }));
  };

  // use local storage for bookmarks
  const [bookmarks, setBookmarks] = useState(
    typeof window !== "undefined" ? localStorage.getItem("bookmarks") : null
  );
  const handleBookmark = () => {
    if (bookmarks) {
      const bookmarksArray = JSON.parse(bookmarks);
      const updatedBookmarks = bookmarksArray.filter(
        (bookmark: string) => bookmark !== postId
      );
      setBookmarks(updatedBookmarks);
      localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
    } else {
      const bookmarksArray = [];
      bookmarksArray.push(postId);
      setBookmarks(JSON.stringify(bookmarksArray));
      localStorage.setItem("bookmarks", JSON.stringify(bookmarksArray));
    }
    console.log("bookmarks", bookmarks);
    console.log("bookmarksArray", bookmarks);
    console.log("updatedBookmarks", bookmarks);
  };

  return (
    <div className="border-b border-gray-200 pb-12">
      {/* Post Header */}
      <div className="flex justify-between items-center py-3">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 mr-3">
            <Image
              src={`https://ui-avatars.com/api/?name=${
                username ?? "username"
              }&background=random`}
              width={40}
              height={40}
              alt="user profile"
              className="rounded-full"
            />
          </div>
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
      <div className="pt-3">
        <div className="flex justify-between mb-2">
          <div className="flex space-x-4">
            <button onClick={() => handleLike(postId as string)}>❤️</button>
            <button onClick={handleCommentClick}>💬</button>
            <button>📤</button>
          </div>
          <Button>
            {bookmarks?.includes(postId) ? (
              <Bookmark onClick={handleBookmark} />
            ) : (
              <BookmarkCheck onClick={handleBookmark} />
            )}
          </Button>
        </div>
        {likeCount > 0 && (
          <div className="text-sm font-semibold">{likeCount} likes</div>
        )}
        {caption && (
          <div className="mt-1 text-sm">
            <span className="font-semibold">{username}</span>
            <span className="ml-1">{caption}</span>
          </div>
        )}
        {/* {commentCount && (
          <div className="mt-1 text-gray-500 text-sm">
            View all{" "}
            {commentsState.commentsObject[postId]?.length === 0
              ? commentCount
              : commentsState.commentsObject[postId]?.length}{" "}
            comments
          </div>
        )} */}

        <div className="mt-2 react-comments">
          {isMounted && (
            <Comments
              postId={postId as string}
              comments={commentsState.commentsObject[postId] || []}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              likes={likeCount}
              commentCount={commentCount}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
