import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { Icon } from "@/components/icons";
import { PostCard } from "@/components/post-card";
import { RightRail } from "@/components/right-rail";
import { StoryRail } from "@/components/story-rail";
import { requireUser } from "@/lib/auth";
import { getFeedPosts, getStories, getSuggestions } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "Home" };

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function FeedPage() {
  const user = await requireUser();
  const [feed, stories, suggestions] = await Promise.all([
    getFeedPosts(user.id),
    getStories(),
    getSuggestions(user.id, 4),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-[1040px] gap-10 px-3 pt-4 sm:px-5 sm:pt-6">
      <div className="mx-auto w-full min-w-0 max-w-[600px] space-y-4 lg:mx-0">
        <div className="flex items-end justify-between px-1">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
              {greeting()}, {user.displayName.split(" ")[0]}
            </p>
            <h1 className="mt-1 font-display text-[26px] leading-none tracking-tight sm:text-[30px]">
              Today&apos;s frames
            </h1>
          </div>
          <Link
            href="/explore"
            className="hidden items-center gap-1.5 text-[12px] font-semibold text-muted transition hover:text-brand sm:flex"
          >
            <Icon name="compass" size={15} />
            Explore
          </Link>
        </div>

        <StoryRail stories={stories} viewer={user} />

        <Link
          href="/create"
          className="flex items-center gap-3 rounded-2xl border border-line bg-paper px-3.5 py-3 transition hover:border-brand/30 hover:bg-white"
        >
          <Avatar src={user.avatarUrl} alt={user.displayName} size={36} />
          <span className="flex-1 text-[13.5px] text-muted">Share a frame from your day…</span>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand">
            <Icon name="camera" size={18} />
          </span>
        </Link>

        {feed.map((post) => (
          <PostCard key={post.id} post={post} viewer={user} />
        ))}

        {feed.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-paper px-6 py-14 text-center">
            <h2 className="font-display text-2xl">A quiet feed</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
              Follow a few creators or publish your first frame to bring this page to life.
            </p>
            <div className="mt-5 flex items-center justify-center gap-2">
              <Link
                href="/explore"
                className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
              >
                Find people
              </Link>
              <Link
                href="/create"
                className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold transition hover:border-brand/40"
              >
                Create a post
              </Link>
            </div>
          </div>
        ) : (
          <p className="px-1 pb-2 pt-1 text-center text-[11px] uppercase tracking-[0.16em] text-muted/80">
            You&apos;re all caught up · go make something
          </p>
        )}
      </div>

      <RightRail viewer={user} suggestions={suggestions} />
    </div>
  );
}
