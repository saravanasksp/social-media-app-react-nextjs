"use client";

import { useActionState, useState } from "react";
import { createPostAction } from "@/app/actions";
import type { GalleryImage } from "@/lib/media";
import type { AuthState, SessionUser } from "@/lib/types";
import { Avatar } from "./avatar";
import { Icon } from "./icons";

const CAPTION_LIMIT = 2200;

export function CreatePostForm({
  viewer,
  gallery,
}: {
  viewer: SessionUser;
  gallery: GalleryImage[];
}) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(createPostAction, {});
  const [selected, setSelected] = useState(gallery[0]?.url ?? "");
  const [customUrl, setCustomUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");

  const imageUrl = customUrl.trim().length > 0 ? customUrl.trim() : selected;

  return (
    <form action={formAction} className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-3">
        <div className="overflow-hidden rounded-2xl border border-line bg-paper">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              Preview
            </h2>
            <span className="flex items-center gap-1 text-[10.5px] uppercase tracking-[0.12em] text-muted">
              <Icon name="image" size={12} /> 1:1 frame
            </span>
          </div>
          <div className="relative aspect-square w-full bg-[#15110e]">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt="Post preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center text-cream/50">
                <Icon name="camera" size={42} />
              </div>
            )}
            {pending ? (
              <div className="absolute inset-0 grid place-items-center bg-ink/60 text-center backdrop-blur-sm">
                <div>
                  <span className="mx-auto block h-7 w-7 animate-spin rounded-full border-2 border-cream/30 border-t-cream" />
                  <p className="mt-3 text-[12.5px] font-semibold text-cream">Developing your frame…</p>
                </div>
              </div>
            ) : null}
          </div>
          <div className="flex items-start gap-2.5 px-4 py-3">
            <Avatar src={viewer.avatarUrl} alt={viewer.displayName} size={28} />
            <p className="min-w-0 text-[13px] leading-snug">
              <span className="mr-1.5 font-semibold">{viewer.username}</span>
              <span className="whitespace-pre-line text-ink/85">
                {caption || "Your caption will appear here…"}
              </span>
              {location ? (
                <span className="mt-1 block text-[11px] text-muted">📍 {location}</span>
              ) : null}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-paper p-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Pick a frame from the studio library
          </h2>
          <div className="mt-2.5 grid grid-cols-4 gap-1.5 sm:grid-cols-6">
            {gallery.map((image) => {
              const active = customUrl.trim().length === 0 && selected === image.url;
              return (
                <button
                  key={image.url}
                  type="button"
                  onClick={() => {
                    setSelected(image.url);
                    setCustomUrl("");
                  }}
                  title={image.label}
                  aria-pressed={active}
                  className={`relative overflow-hidden rounded-lg transition ${
                    active
                      ? "ring-2 ring-brand ring-offset-2 ring-offset-paper"
                      : "opacity-85 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.label}
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                  {active ? (
                    <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-brand text-white">
                      <Icon name="check" size={10} />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-2xl border border-line bg-paper p-4">
          <label className="block">
            <span className="mb-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              Caption <span className="tabular-nums">{CAPTION_LIMIT - caption.length}</span>
            </span>
            <textarea
              name="caption"
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              maxLength={CAPTION_LIMIT}
              rows={5}
              required
              placeholder="What did you notice? Add a little context, or a #tag."
              className="w-full resize-none rounded-xl border border-line bg-white px-3 py-2.5 text-[13px] leading-relaxed outline-none transition placeholder:text-muted/70 focus:border-brand/50 focus:ring-4 focus:ring-brand/10"
            />
          </label>

          <label className="mt-3 block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              Location
            </span>
            <span className="relative block">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <Icon name="mapPin" size={15} />
              </span>
              <input
                name="location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                maxLength={120}
                placeholder="Lisbon, Portugal"
                className="w-full rounded-xl border border-line bg-white py-2.5 pl-9 pr-3 text-[13px] outline-none transition placeholder:text-muted/70 focus:border-brand/50 focus:ring-4 focus:ring-brand/10"
              />
            </span>
          </label>
        </div>

        <div className="rounded-2xl border border-line bg-paper p-4">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              Or paste an image URL
            </span>
            <span className="relative block">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <Icon name="link" size={15} />
              </span>
              <input
                value={customUrl}
                onChange={(event) => setCustomUrl(event.target.value)}
                placeholder="https://images.example.com/frame.jpg"
                className="w-full rounded-xl border border-line bg-white py-2.5 pl-9 pr-3 text-[12.5px] outline-none transition placeholder:text-muted/70 focus:border-brand/50 focus:ring-4 focus:ring-brand/10"
              />
            </span>
          </label>
          <p className="mt-2 text-[11px] leading-relaxed text-muted">
            Vignette stores image links rather than uploads, so use the studio library or any public
            image URL.
          </p>
        </div>

        <input type="hidden" name="imageUrl" value={imageUrl} />

        {state.error ? (
          <p className="rounded-xl border border-brand/20 bg-brand-soft px-3.5 py-2.5 text-[12.5px] font-medium text-brand-dark">
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending || !imageUrl || !caption.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-[13.5px] font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Icon name="sparkles" size={16} />
          {pending ? "Publishing…" : "Share frame"}
        </button>

        <p className="px-1 text-[11px] leading-relaxed text-muted">
          By sharing you&apos;re adding this frame to your profile and the chronological feed of
          everyone who follows you.
        </p>
      </div>
    </form>
  );
}
