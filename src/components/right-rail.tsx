import Link from "next/link";
import { EXPLORE_TAGS } from "@/lib/media";
import type { SuggestedUser } from "@/lib/queries";
import type { SessionUser } from "@/lib/types";
import { Avatar } from "./avatar";
import { FollowButton } from "./follow-button";
import { Icon } from "./icons";

type Props = {
  viewer: SessionUser;
  suggestions: SuggestedUser[];
};

export function RightRail({ viewer, suggestions }: Props) {
  return (
    <aside className="hidden w-[310px] shrink-0 xl:block">
      <div className="sticky top-6 space-y-5 pb-8">
        <div className="flex items-center gap-3">
          <Avatar src={viewer.avatarUrl} alt={viewer.displayName} size={50} ring />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-semibold">{viewer.username}</p>
            <p className="truncate text-[12px] text-muted">{viewer.displayName}</p>
          </div>
          <Link
            href="/settings"
            className="text-[11.5px] font-semibold text-brand transition hover:text-brand-dark"
          >
            Edit
          </Link>
        </div>

        <div className="rounded-2xl border border-line bg-paper p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
              Suggested for you
            </h2>
            <Link href="/search" className="text-[11px] font-semibold text-ink hover:text-brand">
              See all
            </Link>
          </div>

          {suggestions.length === 0 ? (
            <p className="text-[12.5px] leading-relaxed text-muted">
              You already follow every creator on Vignette. Beautifully done.
            </p>
          ) : (
            <ul className="space-y-3">
              {suggestions.map((person) => (
                <li key={person.id} className="flex items-center gap-2.5">
                  <Link href={`/u/${person.username}`} className="shrink-0">
                    <Avatar src={person.avatarUrl} alt={person.displayName} size={36} />
                  </Link>
                  <div className="min-w-0 flex-1 leading-tight">
                    <Link
                      href={`/u/${person.username}`}
                      className="block truncate text-[12.5px] font-semibold hover:text-brand"
                    >
                      {person.username}
                    </Link>
                    <p className="truncate text-[11px] text-muted">
                      {person.followerCount} follower{person.followerCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  <FollowButton targetUserId={person.id} initialFollowing={false} size="sm" />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-gradient-to-br from-sand/70 to-paper p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            <Icon name="sparkles" size={13} className="text-brand" />
            In the light
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {EXPLORE_TAGS.map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="rounded-full border border-line bg-paper px-2.5 py-1 text-[11px] text-ink/80 transition hover:border-brand/40 hover:text-brand"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        <div className="px-1">
          <p className="flex items-start gap-2 rounded-xl bg-sand/60 px-3 py-2.5 text-[11.5px] leading-relaxed text-muted">
            <Icon name="heart" size={14} className="mt-0.5 shrink-0 text-brand" />
            Tip: double-tap a photo to like it. Save the frames you want to come back to.
          </p>
          <p className="mt-3 text-[10.5px] leading-relaxed text-muted/80">
            <Link href="/explore" className="hover:text-ink">
              Explore
            </Link>{" "}
            ·{" "}
            <Link href="/search" className="hover:text-ink">
              Search
            </Link>{" "}
            ·{" "}
            <Link href="/settings" className="hover:text-ink">
              Settings
            </Link>{" "}
            · About · Privacy
          </p>
          <p className="mt-1.5 text-[10.5px] uppercase tracking-[0.14em] text-muted/70">
            © 2026 Vignette
          </p>
        </div>
      </div>
    </aside>
  );
}
