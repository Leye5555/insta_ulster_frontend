export type CommentsResType = {
  _id: string;
  userId: string;
  postId: string;
  username: string;
  avatarUrl: string;
  userProfile: string;
  text: string;
  replies: [CommentsResType];
  commentID: string;
  createdAt: string;
};

export type CommentData = {
  userId: string;
  comId: string;
  postId: string;
  fullName: string;
  userProfile: string;
  text: string;
  avatarUrl: string;
  timestamp: string;
  replies: [];
  parentOfRepliedCommentId?: string;
  repliedToCommentId?: string;
  isEdited?: boolean;
  comIdToDelete?: string;
};
