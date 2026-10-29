"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, ne, or } from "drizzle-orm";
import { db } from "@/db";
import { comments, follows, likes, posts, saves, users } from "@/db/schema";
import { DEMO_CREDENTIALS, ensureSeeded } from "@/db/seed";
import { createSession, destroySession, getCurrentUser } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/password";
import type { AuthState, SessionUser } from "@/lib/types";

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function refreshAll(extraPaths: string[] = []) {
  revalidatePath("/", "layout");
  for (const path of extraPaths) revalidatePath(path);
}

async function currentUserOrRedirect(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function signInAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const identifier = field(formData, "identifier").toLowerCase();
  const password = field(formData, "password");

  if (!identifier || !password) {
    return { error: "Enter your username and password to continue." };
  }

  await ensureSeeded();

  const rows = await db
    .select({
      id: users.id,
      username: users.username,
      passwordHash: users.passwordHash,
    })
    .from(users)
    .where(or(eq(users.username, identifier), eq(users.email, identifier)))
    .limit(1);

  const account = rows[0];
  if (!account) {
    return { error: "We couldn't find an account with those details." };
  }

  const valid = await verifyPassword(password, account.passwordHash);
  if (!valid) {
    return { error: "That password doesn't look right. Try again." };
  }

  await createSession(account.id);
  redirect("/");
}

export async function signUpAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const username = field(formData, "username").toLowerCase();
  const displayName = field(formData, "displayName") || username;
  const email = field(formData, "email").toLowerCase();
  const password = field(formData, "password");

  if (!/^[a-z0-9._]{3,20}$/.test(username)) {
    return { error: "Usernames use 3–20 lowercase letters, numbers, dots or underscores." };
  }
  if (!email.includes("@") || email.length < 5) {
    return { error: "Enter a valid email address." };
  }
  if (password.length < 8) {
    return { error: "Passwords need at least 8 characters." };
  }

  await ensureSeeded();

  const taken = await db
    .select({ id: users.id })
    .from(users)
    .where(or(eq(users.username, username), eq(users.email, email)))
    .limit(1);

  if (taken.length > 0) {
    return { error: "That username or email is already taken." };
  }

  const passwordHash = await hashPassword(password);
  const avatarUrl = `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(
    username,
  )}&backgroundColor=f1e7d9`;

  const created = await db
    .insert(users)
    .values({
      username,
      displayName: displayName.slice(0, 80),
      email,
      passwordHash,
      avatarUrl,
      bio: "",
    })
    .returning({ id: users.id });

  const account = created[0];
  if (!account) {
    return { error: "Something went wrong creating your account. Please try again." };
  }

  const creators = await db
    .select({ id: users.id })
    .from(users)
    .where(ne(users.id, account.id))
    .limit(4);

  if (creators.length > 0) {
    await db
      .insert(follows)
      .values(creators.map((creator) => ({ followerId: account.id, followingId: creator.id })))
      .onConflictDoNothing();
  }

  await createSession(account.id);
  redirect("/");
}

export async function demoSignInAction(): Promise<void> {
  await ensureSeeded();
  const rows = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, DEMO_CREDENTIALS.username))
    .limit(1);

  const demo = rows[0];
  if (!demo) redirect("/login?error=demo");

  await createSession(demo.id);
  redirect("/");
}

export async function signOutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}

export async function toggleLikeAction(postId: number): Promise<void> {
  const user = await currentUserOrRedirect();
  const existing = await db
    .select({ postId: likes.postId })
    .from(likes)
    .where(and(eq(likes.postId, postId), eq(likes.userId, user.id)))
    .limit(1);

  if (existing.length > 0) {
    await db.delete(likes).where(and(eq(likes.postId, postId), eq(likes.userId, user.id)));
  } else {
    await db.insert(likes).values({ postId, userId: user.id }).onConflictDoNothing();
  }

  refreshAll([`/p/${postId}`]);
}

export async function toggleSaveAction(postId: number): Promise<void> {
  const user = await currentUserOrRedirect();
  const existing = await db
    .select({ postId: saves.postId })
    .from(saves)
    .where(and(eq(saves.postId, postId), eq(saves.userId, user.id)))
    .limit(1);

  if (existing.length > 0) {
    await db.delete(saves).where(and(eq(saves.postId, postId), eq(saves.userId, user.id)));
  } else {
    await db.insert(saves).values({ postId, userId: user.id }).onConflictDoNothing();
  }

  refreshAll([`/p/${postId}`, "/saved"]);
}

export async function toggleFollowAction(targetUserId: number): Promise<void> {
  const user = await currentUserOrRedirect();
  if (user.id === targetUserId) return;

  const existing = await db
    .select({ followerId: follows.followerId })
    .from(follows)
    .where(and(eq(follows.followerId, user.id), eq(follows.followingId, targetUserId)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .delete(follows)
      .where(and(eq(follows.followerId, user.id), eq(follows.followingId, targetUserId)));
  } else {
    await db
      .insert(follows)
      .values({ followerId: user.id, followingId: targetUserId })
      .onConflictDoNothing();
  }

  refreshAll();
}

export async function addCommentAction(postId: number, body: string): Promise<void> {
  const user = await currentUserOrRedirect();
  const clean = body.trim().slice(0, 500);
  if (!clean) return;

  await db.insert(comments).values({ postId, userId: user.id, body: clean });
  refreshAll([`/p/${postId}`, "/notifications"]);
}

export async function createPostAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const user = await currentUserOrRedirect();
  const imageUrl = field(formData, "imageUrl");
  const caption = field(formData, "caption").slice(0, 2200);
  const location = field(formData, "location").slice(0, 120);

  if (!isHttpUrl(imageUrl)) {
    return { error: "Choose a photo from the gallery or paste a valid image URL." };
  }
  if (caption.length === 0) {
    return { error: "Add a caption so people know what they're looking at." };
  }

  const created = await db
    .insert(posts)
    .values({
      userId: user.id,
      imageUrl,
      caption,
      location: location.length > 0 ? location : null,
    })
    .returning({ id: posts.id });

  const post = created[0];
  if (!post) return { error: "Could not publish your post. Try again." };

  refreshAll([`/u/${user.username}`]);
  redirect(`/p/${post.id}`);
}

export async function updateProfileAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const user = await currentUserOrRedirect();
  const displayName = field(formData, "displayName").slice(0, 80);
  const username = field(formData, "username").toLowerCase();
  const bio = field(formData, "bio").slice(0, 300);
  const website = field(formData, "website").slice(0, 160);
  const location = field(formData, "location").slice(0, 120);
  const avatarUrl = field(formData, "avatarUrl");

  if (displayName.length === 0) {
    return { error: "Your display name can't be empty." };
  }
  if (!/^[a-z0-9._]{3,20}$/.test(username)) {
    return { error: "Usernames use 3–20 lowercase letters, numbers, dots or underscores." };
  }
  if (!isHttpUrl(avatarUrl)) {
    return { error: "Avatar needs to be a valid image URL." };
  }

  if (username !== user.username) {
    const taken = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    if (taken.length > 0) return { error: "That username is already taken." };
  }

  await db
    .update(users)
    .set({
      displayName,
      username,
      bio,
      website: website.length > 0 ? website : null,
      location: location.length > 0 ? location : null,
      avatarUrl,
    })
    .where(eq(users.id, user.id));

  refreshAll([`/u/${user.username}`, `/u/${username}`, "/settings"]);
  return { success: "Profile saved. Looking good." };
}

export async function deletePostAction(postId: number): Promise<void> {
  const user = await currentUserOrRedirect();
  await db.delete(posts).where(and(eq(posts.id, postId), eq(posts.userId, user.id)));
  refreshAll(["/explore"]);
  redirect("/");
}
