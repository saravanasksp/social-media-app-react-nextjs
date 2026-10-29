import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { FollowButton } from "@/components/follow-button";
import { Icon } from "@/components/icons";
import { PostGrid } from "@/components/post-grid";
import { requireUser } from "@/lib/auth";
import { EXPLORE_TAGS } from "@/lib/media";
import {
  getExplorePosts,
  getFollowingIds,
  getPeople,
  searchPosts,
  searchUsers,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "Search" };

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const user = await requireUser();
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const followingIds = new Set(await getFollowingIds(user.id));

  const [people, peopleResults, postResults] = await Promise.all([
    getPeople(user.id),
    query ? searchUsers(query) : Promise.resolve([]),
    query ? searchPosts(query, user.id) : Promise.resolve([]),
  ]);

  const trending = query ? [] : await getExplorePosts(user.id);

  function personRow(person: {
    id: number;
    username: string;
    displayName: string;
    avatarUrl: string;
    bio: string;
    followerCount: number;
  }) {
    return (
      <li
        key={person.id}
        className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-sand/40"
      >
        <Link href={`/u/${person.username}`} className="shrink-0">
          <Avatar src={person.avatarUrl} alt={person.displayName} size={42} ring />
        </Link>
        <div className="min-w-0 flex-1 leading-tight">
          <Link
            href={`/u/${person.username}`}
            className="block truncate text-[13px] font-semibold hover:text-brand"
          >
            {person.username}
          </Link>
          <p className="truncate text-[11.5px] text-muted">
            {person.displayName} · {person.followerCount} followers
          </p>
          {person.bio ? (
            <p className="mt-0.5 line-clamp-1 text-[11.5px] text-muted/90">
              {person.bio.split("\n")[0]}
            </p>
          ) : null}
        </div>
        <FollowButton
          targetUserId={person.id}
          initialFollowing={followingIds.has(person.id)}
          size="sm"
        />
      </li>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[760px] px-3 pt-5 sm:px-5 sm:pt-7">
      <div className="px-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
          find your people
        </p>
        <h1 className="mt-1 font-display text-[30px] leading-none tracking-tight sm:text-[36px]">
          Search
        </h1>
      </div>

      <form action="/search" method="get" className="mt-4">
        <div className="flex items-center gap-2 rounded-2xl border border-line bg-paper px-3.5 py-2.5 focus-within:border-brand/50 focus-within:ring-4 focus-within:ring-brand/10">
          <Icon name="search" size={18} className="text-muted" />
          <input
            name="q"
            defaultValue={query}
            placeholder="Search people, captions, or #tags"
            aria-label="Search"
            className="min-w-0 flex-1 bg-transparent py-1 text-[13.5px] outline-none placeholder:text-muted/70"
          />
          <button
            type="submit"
            className="rounded-lg bg-ink px-3 py-1.5 text-[12px] font-semibold text-cream transition hover:bg-black"
          >
            Search
          </button>
        </div>
      </form>

      {!query ? (
        <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto pb-1">
          {EXPLORE_TAGS.map((tag) => (
            <Link
              key={tag}
              href={`/search?q=${encodeURIComponent(tag)}`}
              className="shrink-0 rounded-full border border-line bg-paper px-3 py-1.5 text-[12px] text-ink/80 transition hover:border-brand/40 hover:text-brand"
            >
              #{tag}
            </Link>
          ))}
        </div>
      ) : null}

      {query ? (
        <div className="mt-6 space-y-6 pb-8">
          <section className="overflow-hidden rounded-2xl border border-line bg-paper">
            <h2 className="border-b border-line px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              People · {peopleResults.length}
            </h2>
            {peopleResults.length === 0 ? (
              <p className="px-4 py-6 text-[13px] text-muted">
                No creators matched &ldquo;{query}&rdquo;.
              </p>
            ) : (
              <ul className="divide-y divide-line/60 p-1.5">{peopleResults.map(personRow)}</ul>
            )}
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between px-1">
              <h2 className="font-display text-[20px] tracking-tight">Frames</h2>
              <span className="text-[11px] uppercase tracking-[0.14em] text-muted">
                {postResults.length} result{postResults.length === 1 ? "" : "s"}
              </span>
            </div>
            <PostGrid
              posts={postResults}
              emptyTitle="No frames matched"
              emptyBody="Try a broader word, like 'coast', 'coffee', or 'studio'."
              emptyAction={{ href: "/explore", label: "Browse the grid" }}
            />
          </section>
        </div>
      ) : (
        <div className="mt-6 space-y-6 pb-8">
          <section className="overflow-hidden rounded-2xl border border-line bg-paper">
            <h2 className="border-b border-line px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              People to discover
            </h2>
            <ul className="divide-y divide-line/60 p-1.5">{people.map(personRow)}</ul>
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between px-1">
              <h2 className="font-display text-[20px] tracking-tight">Fresh from the grid</h2>
              <Link
                href="/explore"
                className="flex items-center gap-1 text-[11.5px] font-semibold text-muted hover:text-brand"
              >
                See all <Icon name="arrowRight" size={13} />
              </Link>
            </div>
            <PostGrid posts={trending.slice(0, 9)} />
          </section>
        </div>
      )}
    </div>
  );
}
