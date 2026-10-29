"use client";

import Link from "next/link";
import { useOptimistic, useState, useTransition, type FormEvent } from "react";
import {
  addCommentAction,
  deletePostAction,
  toggleLikeAction,
  toggleSaveAction,
} from "@/app/actions";
import { compactNumber, timeAgo } from "@/lib/format";
import type { CommentView, PostView, SessionUser } from "@/lib/types";
import { Avatar } from "./avatar";
import { Icon } from "./icons";

type Props = {
  post: PostView;
  viewer: SessionUser;
  variant?: "feed" | "detail";
};

export function PostCard({ post, viewer, variant = "feed" }: Props) {
  const isDetail = variant === "detail";
  const isOwn = post.author.id === viewer.id;

  const [likeState, applyLike] = useOptimistic(
    { liked: post.likedByMe, count: post.likeCount },
    (current, liked: boolean) => ({
      liked,
      count: Math.max(0, current.count + (liked ? 1 : -1)),
    }),
  );
  const [saved, applySave] = useOptimistic(
    post.savedByMe,
    (_current: boolean, next: boolean) => next,
  );
  const [commentList, applyComment] = useOptimistic(
    post.comments,
    (current: CommentView[], next: CommentView) => [...current, next],
  );

  const [draft, setDraft] = useState("");
  const [burst, setBurst] = useState(false);
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleLike(forceValue?: boolean) {
    const next = forceValue ?? !likeState.liked;
    if (next === likeState.liked) return;
    startTransition(async () => {
      applyLike(next);
      await toggleLikeAction(post.id);
    });
  }

  function handleSave() {
    const next = !saved;
    startTransition(async () => {
      applySave(next);
      await toggleSaveAction(post.id);
    });
  }

  function handleDoubleTap() {
    if (!likeState.liked) handleLike(true);
    setBurst(true);
    window.setTimeout(() => setBurst(false), 780);
  }

  async function copyLink() {
    setMenuOpen(false);
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/p/${post.id}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function handleComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setDraft("");
    const optimistic: CommentView = {
      id: -Date.now(),
      body,
      createdAt: new Date(),
      author: {
        id: viewer.id,
        username: viewer.username,
        displayName: viewer.displayName,
        avatarUrl: viewer.avatarUrl,
      },
    };
    startTransition(async () => {
      applyComment(optimistic);
      await addCommentAction(post.id, body);
    });
  }

  function handleDelete() {
    setMenuOpen(false);
    startTransition(async () => {
      await deletePostAction(post.id);
    });
  }

  const visibleComments = isDetail ? commentList : commentList.slice(-2);
  const hiddenCount = isDetail ? 0 : Math.max(0, post.commentCount - visibleComments.length);

  const header = (
    <div className="flex items-center gap-3 px-4 py-3">
      <Link href={`/u/${post.author.username}`} className="shrink-0">
        <Avatar src={post.author.avatarUrl} alt={post.author.displayName} size={38} ring />
      </Link>
      <div className="min-w-0 flex-1 leading-tight">
        <div className="flex items-center gap-1.5">
          <Link
            href={`/u/${post.author.username}`}
            className="truncate text-[13.5px] font-semibold hover:text-brand"
          >
            {post.author.username}
          </Link>
          <span className="text-[11px] text-muted/70">·</span>
          <span suppressHydrationWarning className="text-[11px] text-muted">
            {timeAgo(post.createdAt)}
          </span>
        </div>
        {post.location ? (
          <p className="mt-0.5 truncate text-[11.5px] text-muted">{post.location}</p>
        ) : (
          <p className="mt-0.5 truncate text-[11.5px] text-muted">{post.author.displayName}</p>
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-full p-1.5 text-muted transition hover:bg-sand hover:text-ink"
          aria-label="Post options"
          aria-expanded={menuOpen}
        >
          <Icon name="more" size={19} />
        </button>
        {menuOpen ? (
          <>
            <button
              type="button"
              className="fixed inset-0 z-20 cursor-default"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 top-9 z-30 w-44 overflow-hidden rounded-xl border border-line bg-paper py-1 shadow-xl animate-fade">
              <button
                type="button"
                onClick={copyLink}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] transition hover:bg-sand"
              >
                <Icon name="link" size={15} /> Copy link
              </button>
              <Link
                href={`/u/${post.author.username}`}
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] transition hover:bg-sand"
              >
                <Icon name="user" size={15} /> View profile
              </Link>
              {isOwn ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex w-full items-center gap-2 border-t border-line px-3 py-2 text-left text-[13px] text-brand transition hover:bg-brand-soft"
                >
                  <Icon name="trash" size={15} /> Delete post
                </button>
              ) : (
                <Link
                  href={`/p/${post.id}`}
                  className="flex w-full items-center gap-2 border-t border-line px-3 py-2 text-left text-[13px] transition hover:bg-sand"
                >
                  <Icon name="comment" size={15} /> Open post
                </Link>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );

  const actionBar = (
    <div className="flex items-center gap-1 px-3 pt-2.5">
      <button
        type="button"
        onClick={() => handleLike()}
        disabled={pending}
        aria-label={likeState.liked ? "Unlike post" : "Like post"}
        aria-pressed={likeState.liked}
        className={`rounded-full p-1.5 transition active:scale-90 ${
          likeState.liked ? "text-brand" : "text-ink hover:text-brand"
        }`}
      >
        <span className={likeState.liked ? "inline-block animate-pop" : "inline-block"}>
          <Icon name="heart" size={24} filled={likeState.liked} />
        </span>
      </button>

      <Link
        href={`/p/${post.id}`}
        aria-label="Read comments"
        className="rounded-full p-1.5 text-ink transition hover:text-brand"
      >
        <Icon name="comment" size={23} />
      </Link>

      <button
        type="button"
        onClick={copyLink}
        aria-label="Share post"
        className="rounded-full p-1.5 text-ink transition hover:text-brand"
      >
        <Icon name="send" size={23} />
      </button>

      <button
        type="button"
        onClick={handleSave}
        disabled={pending}
        aria-label={saved ? "Remove from saved" : "Save post"}
        aria-pressed={saved}
        className={`ml-auto rounded-full p-1.5 transition active:scale-90 ${
          saved ? "text-brand" : "text-ink hover:text-brand"
        }`}
      >
        <Icon name="bookmark" size={23} filled={saved} />
      </button>
    </div>
  );

  const captionAndComments = (
    <div className={`px-4 ${isDetail ? "flex-1 overflow-y-auto" : ""}`}>
      <p className="text-[13px] font-semibold tabular-nums">
        {compactNumber(likeState.count)} likes
      </p>

      {post.caption ? (
        <p className="mt-1.5 whitespace-pre-line text-[13.5px] leading-relaxed">
          <Link
            href={`/u/${post.author.username}`}
            className="mr-1.5 font-semibold hover:text-brand"
          >
            {post.author.username}
          </Link>
          {post.caption}
        </p>
      ) : null}

      <div className="mt-2 space-y-1.5">
        {visibleComments.map((comment) => (
          <p key={comment.id} className="text-[13px] leading-snug">
            <Link
              href={`/u/${comment.author.username}`}
              className="mr-1.5 font-semibold hover:text-brand"
            >
              {comment.author.username}
            </Link>
            <span className="text-ink/85">{comment.body}</span>
          </p>
        ))}
      </div>

      {hiddenCount > 0 ? (
        <Link
          href={`/p/${post.id}`}
          className="mt-1.5 inline-block text-[13px] text-muted transition hover:text-ink"
        >
          View all {post.commentCount} comments
        </Link>
      ) : null}

      {isDetail && commentList.length === 0 ? (
        <p className="mt-3 rounded-xl bg-sand/60 px-3 py-2.5 text-[13px] text-muted">
          No comments yet. Say something kind about this frame.
        </p>
      ) : null}
    </div>
  );

  const composer = (
    <form onSubmit={handleComment} className="mt-2.5 border-t border-line px-3 py-2.5">
      <div className="flex items-center gap-2">
        <Avatar src={viewer.avatarUrl} alt={viewer.displayName} size={26} />
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Add a comment…"
          aria-label="Add a comment"
          maxLength={500}
          className="min-w-0 flex-1 bg-transparent py-1 text-[13px] outline-none placeholder:text-muted/80"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="text-[12px] font-semibold text-brand transition disabled:text-muted/40"
        >
          Post
        </button>
      </div>
    </form>
  );

  const image = (
    <div className="relative h-full w-full bg-[#15110e]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={post.imageUrl}
        alt={post.caption || `Photo shared by ${post.author.username}`}
        onDoubleClick={handleDoubleTap}
        draggable={false}
        loading={isDetail ? "eager" : "lazy"}
        className={`w-full select-none object-cover ${
          isDetail ? "aspect-square md:h-full md:aspect-auto" : "aspect-square"
        }`}
      />
      {burst ? (
        <span className="pointer-events-none absolute inset-0 grid place-items-center">
          <Icon name="heart" size={112} filled className="animate-burst text-white/95 drop-shadow-xl" />
        </span>
      ) : null}
      {copied ? (
        <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-ink/85 px-3 py-1.5 text-[12px] font-medium text-white animate-fade">
          Link copied
        </span>
      ) : null}
    </div>
  );

  if (isDetail) {
    return (
      <article className="overflow-hidden rounded-3xl border border-line bg-paper shadow-[0_18px_50px_rgba(29,25,22,0.08)] md:grid md:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
        <div className="md:max-h-[calc(100vh-11rem)]">{image}</div>
        <div className="flex min-h-0 flex-col md:max-h-[calc(100vh-11rem)]">
          {header}
          <div className="border-t border-line" />
          {captionAndComments}
          <div className="mt-auto">
            {actionBar}
            <p className="px-4 pt-1 text-[10.5px] uppercase tracking-[0.1em] text-muted">
              {timeAgo(post.createdAt)} ago
            </p>
            {composer}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_2px_18px_rgba(29,25,22,0.04)]">
      {header}
      {image}
      {actionBar}
      <div className="pb-3">
        {captionAndComments}
        {composer}
      </div>
    </article>
  );
}
