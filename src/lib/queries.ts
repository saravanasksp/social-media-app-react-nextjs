import { and, desc, eq, ilike, inArray, ne, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { comments, follows, likes, posts, saves, stories, users } from "@/db/schema";
import type {
  ActivityView,
  Author,
  CommentView,
  PostView,
  ProfileView,
  StoryView,
} from "@/lib/types";

type PostBase = {
  id: number;
  imageUrl: string;
  caption: string;
  location: string | null;
  createdAt: Date;
  authorId: number;
  username: string;
  displayName: string;
  avatarUrl: string;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  savedByMe: boolean;
};

function postsQuery(viewerId: number | null) {
  return db
    .select({
      id: posts.id,
      imageUrl: posts.imageUrl,
      caption: posts.caption,
      location: posts.location,
      createdAt: posts.createdAt,
      authorId: users.id,
      username: users.username,
      displayName: users.displayName,
      avatarUrl: users.avatarUrl,
      likeCount:
        sql<number>`(select count(*)::int from ${likes} where ${likes.postId} = ${posts.id})`.mapWith(
          Number,
        ),
      commentCount:
        sql<number>`(select count(*)::int from ${comments} where ${comments.postId} = ${posts.id})`.mapWith(
          Number,
        ),
      likedByMe:
        viewerId === null
          ? sql<boolean>`false`
          : sql<boolean>`exists(select 1 from ${likes} where ${likes.postId} = ${posts.id} and ${likes.userId} = ${viewerId})`,
      savedByMe:
        viewerId === null
          ? sql<boolean>`false`
          : sql<boolean>`exists(select 1 from ${saves} where ${saves.postId} = ${posts.id} and ${saves.userId} = ${viewerId})`,
    })
    .from(posts)
    .innerJoin(users, eq(posts.userId, users.id));
}

async function hydratePosts(rows: PostBase[], commentLimit = 2): Promise<PostView[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((row) => row.id);
  const commentRows = await db
    .select({
      id: comments.id,
      postId: comments.postId,
      body: comments.body,
      createdAt: comments.createdAt,
      authorId: users.id,
      username: users.username,
      displayName: users.displayName,
      avatarUrl: users.avatarUrl,
    })
    .from(comments)
    .innerJoin(users, eq(comments.userId, users.id))
    .where(inArray(comments.postId, ids))
    .orderBy(desc(comments.createdAt));

  const grouped = new Map<number, CommentView[]>();
  for (const row of commentRows) {
    const list = grouped.get(row.postId) ?? [];
    if (list.length < commentLimit) {
      list.push({
        id: row.id,
        body: row.body,
        createdAt: row.createdAt,
        author: {
          id: row.authorId,
          username: row.username,
          displayName: row.displayName,
          avatarUrl: row.avatarUrl,
        },
      });
      grouped.set(row.postId, list);
    }
  }

  return rows.map((row) => ({
    id: row.id,
    imageUrl: row.imageUrl,
    caption: row.caption,
    location: row.location,
    createdAt: row.createdAt,
    likeCount: row.likeCount,
    commentCount: row.commentCount,
    likedByMe: row.likedByMe,
    savedByMe: row.savedByMe,
    author: {
      id: row.authorId,
      username: row.username,
      displayName: row.displayName,
      avatarUrl: row.avatarUrl,
    },
    comments: (grouped.get(row.id) ?? []).slice().reverse(),
  }));
}

export async function getFeedPosts(viewerId: number): Promise<PostView[]> {
  const following = await db
    .select({ id: follows.followingId })
    .from(follows)
    .where(eq(follows.followerId, viewerId));

  const authorIds = [viewerId, ...following.map((row) => row.id)];
  let rows = await postsQuery(viewerId)
    .where(inArray(posts.userId, authorIds))
    .orderBy(desc(posts.createdAt))
    .limit(15);

  if (rows.length < 5) {
    rows = await postsQuery(viewerId).orderBy(desc(posts.createdAt)).limit(15);
  }

  return hydratePosts(rows);
}

export async function getExplorePosts(viewerId: number | null): Promise<PostView[]> {
  const rows = await postsQuery(viewerId).orderBy(desc(posts.createdAt)).limit(30);
  return hydratePosts(rows, 0);
}

export async function getPostById(
  postId: number,
  viewerId: number | null,
): Promise<PostView | null> {
  const rows = await postsQuery(viewerId).where(eq(posts.id, postId)).limit(1);
  const hydrated = await hydratePosts(rows, 200);
  return hydrated[0] ?? null;
}

export async function getSavedPosts(viewerId: number): Promise<PostView[]> {
  const rows = await postsQuery(viewerId)
    .innerJoin(saves, eq(saves.postId, posts.id))
    .where(eq(saves.userId, viewerId))
    .orderBy(desc(saves.createdAt))
    .limit(30);
  return hydratePosts(rows, 0);
}

export async function getUserByUsername(username: string) {
  const rows = await db
    .select({
      id: users.id,
      username: users.username,
      displayName: users.displayName,
      avatarUrl: users.avatarUrl,
      bio: users.bio,
      website: users.website,
      location: users.location,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.username, username.toLowerCase()))
    .limit(1);
  return rows[0] ?? null;
}

export async function getProfile(
  username: string,
  viewerId: number | null,
): Promise<ProfileView | null> {
  const rows = await db
    .select({
      id: users.id,
      username: users.username,
      displayName: users.displayName,
      avatarUrl: users.avatarUrl,
      bio: users.bio,
      website: users.website,
      location: users.location,
      createdAt: users.createdAt,
      postCount:
        sql<number>`(select count(*)::int from ${posts} where ${posts.userId} = ${users.id})`.mapWith(
          Number,
        ),
      followerCount:
        sql<number>`(select count(*)::int from ${follows} where ${follows.followingId} = ${users.id})`.mapWith(
          Number,
        ),
      followingCount:
        sql<number>`(select count(*)::int from ${follows} where ${follows.followerId} = ${users.id})`.mapWith(
          Number,
        ),
      isFollowedByMe:
        viewerId === null
          ? sql<boolean>`false`
          : sql<boolean>`exists(select 1 from ${follows} where ${follows.followerId} = ${viewerId} and ${follows.followingId} = ${users.id})`,
    })
    .from(users)
    .where(eq(users.username, username.toLowerCase()))
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  return {
    user: {
      id: row.id,
      username: row.username,
      displayName: row.displayName,
      avatarUrl: row.avatarUrl,
      bio: row.bio,
      website: row.website,
      location: row.location,
      createdAt: row.createdAt,
    },
    postCount: row.postCount,
    followerCount: row.followerCount,
    followingCount: row.followingCount,
    isFollowedByMe: row.isFollowedByMe,
    isMe: viewerId === row.id,
  };
}

export async function getUserPosts(userId: number, viewerId: number | null): Promise<PostView[]> {
  const rows = await postsQuery(viewerId)
    .where(eq(posts.userId, userId))
    .orderBy(desc(posts.createdAt))
    .limit(30);
  return hydratePosts(rows, 0);
}

export type SuggestedUser = {
  id: number;
  username: string;
  displayName: string;
  avatarUrl: string;
  followerCount: number;
};

export async function getSuggestions(
  viewerId: number,
  limit = 5,
): Promise<SuggestedUser[]> {
  const rows = await db
    .select({
      id: users.id,
      username: users.username,
      displayName: users.displayName,
      avatarUrl: users.avatarUrl,
      followerCount:
        sql<number>`(select count(*)::int from ${follows} where ${follows.followingId} = ${users.id})`.mapWith(
          Number,
        ),
    })
    .from(users)
    .where(
      and(
        ne(users.id, viewerId),
        sql`not exists (select 1 from ${follows} where ${follows.followerId} = ${viewerId} and ${follows.followingId} = ${users.id})`,
      ),
    )
    .orderBy(desc(sql`(select count(*) from ${follows} where ${follows.followingId} = ${users.id})`))
    .limit(limit);

  return rows;
}

export async function isFollowing(viewerId: number, targetUserId: number): Promise<boolean> {
  const rows = await db
    .select({ followerId: follows.followerId })
    .from(follows)
    .where(and(eq(follows.followerId, viewerId), eq(follows.followingId, targetUserId)))
    .limit(1);
  return rows.length > 0;
}

export async function getFollowingIds(viewerId: number): Promise<number[]> {
  const rows = await db
    .select({ id: follows.followingId })
    .from(follows)
    .where(eq(follows.followerId, viewerId));
  return rows.map((row) => row.id);
}

export async function getStories(): Promise<StoryView[]> {
  const rows = await db
    .select({
      id: stories.id,
      imageUrl: stories.imageUrl,
      caption: stories.caption,
      authorId: users.id,
      username: users.username,
      displayName: users.displayName,
      avatarUrl: users.avatarUrl,
      createdAt: stories.createdAt,
    })
    .from(stories)
    .innerJoin(users, eq(stories.userId, users.id))
    .orderBy(desc(stories.createdAt))
    .limit(12);

  return rows.map((row) => ({
    id: row.id,
    imageUrl: row.imageUrl,
    caption: row.caption,
    user: {
      id: row.authorId,
      username: row.username,
      displayName: row.displayName,
      avatarUrl: row.avatarUrl,
    },
  }));
}

export async function getActivity(viewerId: number): Promise<ActivityView[]> {
  const likeRows = await db
    .select({
      postId: likes.postId,
      createdAt: likes.createdAt,
      postImage: posts.imageUrl,
      actorId: users.id,
      username: users.username,
      displayName: users.displayName,
      avatarUrl: users.avatarUrl,
    })
    .from(likes)
    .innerJoin(posts, eq(likes.postId, posts.id))
    .innerJoin(users, eq(likes.userId, users.id))
    .where(and(eq(posts.userId, viewerId), ne(likes.userId, viewerId)))
    .orderBy(desc(likes.createdAt))
    .limit(15);

  const commentRows = await db
    .select({
      postId: comments.postId,
      body: comments.body,
      createdAt: comments.createdAt,
      postImage: posts.imageUrl,
      actorId: users.id,
      username: users.username,
      displayName: users.displayName,
      avatarUrl: users.avatarUrl,
    })
    .from(comments)
    .innerJoin(posts, eq(comments.postId, posts.id))
    .innerJoin(users, eq(comments.userId, users.id))
    .where(and(eq(posts.userId, viewerId), ne(comments.userId, viewerId)))
    .orderBy(desc(comments.createdAt))
    .limit(15);

  const followRows = await db
    .select({
      createdAt: follows.createdAt,
      actorId: users.id,
      username: users.username,
      displayName: users.displayName,
      avatarUrl: users.avatarUrl,
    })
    .from(follows)
    .innerJoin(users, eq(follows.followerId, users.id))
    .where(and(eq(follows.followingId, viewerId), ne(follows.followerId, viewerId)))
    .orderBy(desc(follows.createdAt))
    .limit(15);

  const actorFrom = (row: {
    actorId: number;
    username: string;
    displayName: string;
    avatarUrl: string;
  }): Author => ({
    id: row.actorId,
    username: row.username,
    displayName: row.displayName,
    avatarUrl: row.avatarUrl,
  });

  const activity: ActivityView[] = [
    ...likeRows.map((row, index) => ({
      key: `like-${row.postId}-${row.actorId}-${index}`,
      kind: "like" as const,
      createdAt: row.createdAt,
      actor: actorFrom(row),
      postId: row.postId,
      postImage: row.postImage,
      body: null,
    })),
    ...commentRows.map((row, index) => ({
      key: `comment-${row.postId}-${row.actorId}-${index}`,
      kind: "comment" as const,
      createdAt: row.createdAt,
      actor: actorFrom(row),
      postId: row.postId,
      postImage: row.postImage,
      body: row.body,
    })),
    ...followRows.map((row, index) => ({
      key: `follow-${row.actorId}-${index}`,
      kind: "follow" as const,
      createdAt: row.createdAt,
      actor: actorFrom(row),
      postId: null,
      postImage: null,
      body: null,
    })),
  ];

  return activity
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 30);
}

export async function searchUsers(query: string) {
  const value = `%${query}%`;
  return db
    .select({
      id: users.id,
      username: users.username,
      displayName: users.displayName,
      avatarUrl: users.avatarUrl,
      bio: users.bio,
      followerCount:
        sql<number>`(select count(*)::int from ${follows} where ${follows.followingId} = ${users.id})`.mapWith(
          Number,
        ),
    })
    .from(users)
    .where(or(ilike(users.username, value), ilike(users.displayName, value)))
    .orderBy(desc(sql`(select count(*) from ${follows} where ${follows.followingId} = ${users.id})`))
    .limit(8);
}

export async function searchPosts(query: string, viewerId: number | null): Promise<PostView[]> {
  const rows = await postsQuery(viewerId)
    .where(ilike(posts.caption, `%${query}%`))
    .orderBy(desc(posts.createdAt))
    .limit(12);
  return hydratePosts(rows, 0);
}

export async function getPeople(viewerId: number) {
  return db
    .select({
      id: users.id,
      username: users.username,
      displayName: users.displayName,
      avatarUrl: users.avatarUrl,
      bio: users.bio,
      followerCount:
        sql<number>`(select count(*)::int from ${follows} where ${follows.followingId} = ${users.id})`.mapWith(
          Number,
        ),
    })
    .from(users)
    .where(ne(users.id, viewerId))
    .orderBy(desc(sql`(select count(*) from ${follows} where ${follows.followingId} = ${users.id})`))
    .limit(8);
}

export async function findUserForLogin(identifier: string) {
  const rows = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      passwordHash: users.passwordHash,
    })
    .from(users)
    .where(
      or(
        eq(users.username, identifier.toLowerCase()),
        eq(users.email, identifier.toLowerCase()),
      ),
    )
    .limit(1);
  return rows[0] ?? null;
}
