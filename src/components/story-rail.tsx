"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { SessionUser, StoryView } from "@/lib/types";
import { Avatar } from "./avatar";
import { Icon } from "./icons";

const STORY_MS = 5000;

export function StoryRail({ stories, viewer }: { stories: StoryView[]; viewer: SessionUser }) {
  const [index, setIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (index === null) return;
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      const value = Math.min(1, (Date.now() - startedAt) / STORY_MS);
      setProgress(value);
      if (value >= 1) {
        window.clearInterval(timer);
        setProgress(0);
        setIndex((current) => {
          if (current === null) return null;
          return current + 1 < stories.length ? current + 1 : null;
        });
      }
    }, 50);
    return () => window.clearInterval(timer);
  }, [index, stories.length]);

  function goTo(target: number | null) {
    setProgress(0);
    setIndex(target);
  }

  useEffect(() => {
    if (index === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    const currentIndex = index;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProgress(0);
        setIndex(null);
      }
      if (event.key === "ArrowRight") {
        setProgress(0);
        setIndex(Math.min(currentIndex + 1, stories.length - 1));
      }
      if (event.key === "ArrowLeft") {
        setProgress(0);
        setIndex(Math.max(currentIndex - 1, 0));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, stories.length]);

  const active = index === null ? null : stories[index];

  return (
    <>
      <section className="rounded-2xl border border-line bg-paper px-3 py-3.5">
        <div className="mb-2.5 flex items-center justify-between px-1">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Stories
          </h2>
          <span className="flex items-center gap-1 text-[11px] text-muted">
            <Icon name="sparkles" size={12} className="text-brand" /> today
          </span>
        </div>
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-1">
          <Link href="/create" className="group flex w-[66px] shrink-0 flex-col items-center gap-1.5">
            <span className="relative">
              <span className="flex h-[60px] w-[60px] items-center justify-center rounded-full border border-dashed border-line bg-cream transition group-hover:border-brand">
                <Avatar src={viewer.avatarUrl} alt={viewer.displayName} size={54} />
              </span>
              <span className="absolute -bottom-0.5 -right-0.5 grid h-[21px] w-[21px] place-items-center rounded-full border-2 border-paper bg-brand text-white">
                <Icon name="plus" size={12} />
              </span>
            </span>
            <span className="w-full truncate text-center text-[11px] text-muted">Your story</span>
          </Link>

          {stories.map((story, storyIndex) => (
            <button
              type="button"
              key={story.id}
              onClick={() => goTo(storyIndex)}
              className="group flex w-[66px] shrink-0 flex-col items-center gap-1.5"
            >
              <span className="rounded-full bg-[conic-gradient(from_200deg,#d9663a,#e8b23f,#2f4a3f,#d9663a)] p-[2.5px] transition group-hover:scale-[1.03]">
                <span className="rounded-full bg-paper p-[2px]">
                  <Avatar src={story.user.avatarUrl} alt={story.user.displayName} size={53} />
                </span>
              </span>
              <span className="w-full truncate text-center text-[11px] text-muted">
                {story.user.username}
              </span>
            </button>
          ))}
        </div>
      </section>

      {active && index !== null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-3 backdrop-blur-sm animate-fade"
          role="dialog"
          aria-modal="true"
          aria-label={`${active.user.username}'s story`}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close story"
            onClick={() => goTo(null)}
          />
          <div className="relative z-10 w-full max-w-[400px] overflow-hidden rounded-3xl bg-black shadow-2xl">
            <div className="relative aspect-[9/16] max-h-[84vh] w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={active.imageUrl}
                alt={active.caption || `Story by ${active.user.username}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/70" />

              <div className="absolute inset-x-0 top-0 px-3 pt-3">
                <div className="mb-2.5 flex gap-1">
                  {stories.map((story, storyIndex) => (
                    <span
                      key={story.id}
                      className="h-[2.5px] flex-1 overflow-hidden rounded-full bg-white/35"
                    >
                      <span
                        className="block h-full rounded-full bg-white transition-[width] duration-75"
                        style={{
                          width:
                            storyIndex < index
                              ? "100%"
                              : storyIndex === index
                                ? `${Math.round(progress * 100)}%`
                                : "0%",
                        }}
                      />
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2.5">
                  <Avatar src={active.user.avatarUrl} alt={active.user.displayName} size={32} />
                  <div className="min-w-0 flex-1 leading-tight">
                    <p className="truncate text-[13px] font-semibold text-white">
                      {active.user.username}
                    </p>
                    <p className="text-[11px] text-white/70">today · story</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => goTo(null)}
                    aria-label="Close"
                    className="rounded-full p-1.5 text-white/90 transition hover:bg-white/15"
                  >
                    <Icon name="close" size={18} />
                  </button>
                </div>
              </div>

              <button
                type="button"
                aria-label="Previous story"
                onClick={() => goTo(Math.max(0, index - 1))}
                className="absolute inset-y-16 left-0 w-1/4"
              />
              <button
                type="button"
                aria-label="Next story"
                onClick={() => goTo(index + 1 < stories.length ? index + 1 : null)}
                className="absolute inset-y-16 right-0 w-1/4"
              />

              <div className="absolute inset-x-0 bottom-0 px-4 pb-4">
                {active.caption ? (
                  <p className="rounded-2xl bg-black/35 px-3 py-2 text-[13px] leading-snug text-white backdrop-blur-sm">
                    {active.caption}
                  </p>
                ) : null}
                <Link
                  href={`/u/${active.user.username}`}
                  onClick={() => goTo(null)}
                  className="mt-2.5 inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-white/85 hover:text-white"
                >
                  View profile <Icon name="arrowRight" size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
