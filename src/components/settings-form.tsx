"use client";

import { useActionState, useState } from "react";
import { updateProfileAction } from "@/app/actions";
import type { AuthState, SessionUser } from "@/lib/types";
import { Avatar } from "./avatar";
import { Icon } from "./icons";

const inputClass =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[13px] outline-none transition placeholder:text-muted/70 focus:border-brand/50 focus:ring-4 focus:ring-brand/10";

export function SettingsForm({ viewer }: { viewer: SessionUser }) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    updateProfileAction,
    {},
  );
  const [avatarUrl, setAvatarUrl] = useState(viewer.avatarUrl);
  const [bio, setBio] = useState(viewer.bio);

  return (
    <form action={formAction} className="space-y-4">
      <div className="flex items-center gap-4 rounded-2xl border border-line bg-sand/40 p-4">
        <Avatar src={avatarUrl || viewer.avatarUrl} alt={viewer.displayName} size={64} ring />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold">{viewer.username}</p>
          <p className="text-[11.5px] text-muted">Update your portrait link below.</p>
        </div>
        <span className="rounded-full bg-paper px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
          live preview
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
            Display name
          </span>
          <input
            name="displayName"
            defaultValue={viewer.displayName}
            required
            maxLength={80}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
            Username
          </span>
          <input
            name="username"
            defaultValue={viewer.username}
            required
            maxLength={20}
            pattern="[a-z0-9._]{3,20}"
            className={inputClass}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
          Bio <span className="tabular-nums text-muted/70">{300 - bio.length}</span>
        </span>
        <textarea
          name="bio"
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          rows={4}
          maxLength={300}
          placeholder="A sentence or two about how you see things."
          className={`${inputClass} resize-none leading-relaxed`}
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
            Website
          </span>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              <Icon name="globe" size={15} />
            </span>
            <input
              name="website"
              defaultValue={viewer.website ?? ""}
              maxLength={160}
              placeholder="yourstudio.com"
              className={`${inputClass} pl-9`}
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
            Location
          </span>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              <Icon name="mapPin" size={15} />
            </span>
            <input
              name="location"
              defaultValue={viewer.location ?? ""}
              maxLength={120}
              placeholder="Lisbon, Portugal"
              className={`${inputClass} pl-9`}
            />
          </div>
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
          Avatar image URL
        </span>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            <Icon name="link" size={15} />
          </span>
          <input
            name="avatarUrl"
            value={avatarUrl}
            onChange={(event) => setAvatarUrl(event.target.value)}
            required
            className={`${inputClass} pl-9`}
          />
        </div>
      </label>

      {state.error ? (
        <p className="rounded-xl border border-brand/20 bg-brand-soft px-3.5 py-2.5 text-[12.5px] font-medium text-brand-dark">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="flex items-center gap-2 rounded-xl border border-forest/20 bg-forest/10 px-3.5 py-2.5 text-[12.5px] font-medium text-forest">
          <Icon name="check" size={14} /> {state.success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-[13px] font-semibold text-cream transition hover:bg-black disabled:opacity-70"
      >
        {pending ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-cream/40 border-t-cream" />
            Saving…
          </>
        ) : (
          <>
            <Icon name="check" size={15} /> Save changes
          </>
        )}
      </button>
    </form>
  );
}
