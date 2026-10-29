import Link from "next/link";
import { Icon } from "@/components/icons";
import { PostGrid } from "@/components/post-grid";
import { requireUser } from "@/lib/auth";
import { EXPLORE_TAGS } from "@/lib/media";
import { getExplorePosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "Explore" };

export default async function ExplorePage() {
  const user = await requireUser();
  const posts = await getExplorePosts(user.id);
  const [hero, ...rest] = posts;
  const spotlights = rest.slice(0, 2);
  const gridPosts = rest.slice(2);

  return (
    <div className="mx-auto w-full max-w-[935px] px-3 pt-5 sm:px-5 sm:pt-7">
      <div className="flex flex-wrap items-end justify-between gap-3 px-1">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
            the discovery grid
          </p>
          <h1 className="mt-1 font-display text-[30px] leading-none tracking-tight sm:text-[36px]">
            Explore
          </h1>
          <p className="mt-2 max-w-md text-[13px] leading-relaxed text-muted">
            Fresh frames from the community. Double-tap anything that stops you.
          </p>
        </div>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-paper px-3.5 py-2.5 text-[12.5px] font-semibold transition hover:border-brand/40"
        >
          <Icon name="search" size={15} />
          Search people
        </Link>
      </div>

      <div className="no-scrollbar mt-4 flex gap-1.5 overflow-x-auto pb-1">
        {EXPLORE_TAGS.map((tag, index) => (
          <Link
            key={tag}
            href={`/search?q=${encodeURIComponent(tag)}`}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-[12px] transition ${
              index === 0
                ? "border-transparent bg-ink text-cream"
                : "border-line bg-paper text-ink/80 hover:border-brand/40 hover:text-brand"
            }`}
          >
            #{tag}
          </Link>
        ))}
      </div>

      {hero ? (
        <div className="mt-5 grid gap-1.5 sm:grid-cols-3">
          <Link
            href={`/p/${hero.id}`}
            className="group relative overflow-hidden rounded-xl sm:col-span-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hero.imageUrl}
              alt={hero.caption || `Photo by ${hero.author.username}`}
              className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.02] sm:aspect-[16/11]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={hero.author.avatarUrl}
                  alt=""
                  className="h-7 w-7 rounded-full object-cover ring-2 ring-white/60"
                />
                <span className="text-[12.5px] font-semibold text-white">
                  {hero.author.username}
                </span>
                {hero.location ? (
                  <span className="hidden text-[11px] text-white/70 sm:inline">
                    · {hero.location}
                  </span>
                ) : null}
              </div>
              <p className="mt-1.5 line-clamp-2 max-w-lg text-[13px] leading-snug text-white/90">
                {hero.caption}
              </p>
            </div>
          </Link>

          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-1">
            {spotlights.map((post) => (
              <Link
                key={post.id}
                href={`/p/${post.id}`}
                className="group relative overflow-hidden rounded-xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.imageUrl}
                  alt={post.caption || `Photo by ${post.author.username}`}
                  className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.03] sm:aspect-[16/9]"
                />
                <span className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-ink/70 to-transparent p-2.5 opacity-0 transition group-hover:opacity-100">
                  <span className="text-[11.5px] font-semibold text-white">
                    @{post.author.username}
                  </span>
                  <span className="flex items-center gap-1 text-[11.5px] font-semibold text-white">
                    <Icon name="heart" size={13} filled /> {post.likeCount}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex items-center justify-between px-1">
        <h2 className="font-display text-[20px] tracking-tight">Latest frames</h2>
        <span className="text-[11px] uppercase tracking-[0.14em] text-muted">
          {posts.length} photos
        </span>
      </div>

      <div className="mt-3 pb-6">
        <PostGrid
          posts={gridPosts}
          emptyTitle="The grid is warming up"
          emptyBody="New frames appear here as soon as creators post them."
          emptyAction={{ href: "/create", label: "Share the first frame" }}
        />
      </div>
    </div>
  );
}
