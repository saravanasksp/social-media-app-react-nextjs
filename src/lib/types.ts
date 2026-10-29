export type Author = {
  id: number;
  username: string;
  displayName: string;
  avatarUrl: string;
};

export type CommentView = {
  id: number;
  body: string;
  createdAt: Date;
  author: Author;
};

export type PostView = {
  id: number;
  imageUrl: string;
  caption: string;
  location: string | null;
  createdAt: Date;
  author: Author;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  savedByMe: boolean;
  comments: CommentView[];
};

export type StoryView = {
  id: number;
  imageUrl: string;
  caption: string;
  user: Author;
};

export type ProfileView = {
  user: Author & {
    bio: string;
    website: string | null;
    location: string | null;
    createdAt: Date;
  };
  postCount: number;
  followerCount: number;
  followingCount: number;
  isFollowedByMe: boolean;
  isMe: boolean;
};

export type ActivityView = {
  key: string;
  kind: "like" | "comment" | "follow";
  createdAt: Date;
  actor: Author;
  postId: number | null;
  postImage: string | null;
  body: string | null;
};

export type SessionUser = Author & {
  email: string;
  bio: string;
  website: string | null;
  location: string | null;
  createdAt: Date;
};

export type AuthState = { error?: string; success?: string };

export type CurrentUser = SessionUser;
