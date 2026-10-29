import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/avatar";
import { FollowButton } from "@/components/follow-button";
import { Icon } from "@/components/icons";
import { PostCard } from "@/components/post-card";
import { requireUser } from "@/lib/auth";
import { compactNumber } from "@/lib/format";
import { getPostById, getUserPosts, isFollowing } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function PostPage({ params }: Props) {
  const viewer = await requireUser();
  const { id } = await params;
  const postId = Number(id);

  if (!Number.isFinite(postId) || !Number.isInteger(postId)) notFound();

  const post = await getPostById(postId, viewer.id);
  if (!post) notFound();

  const [authorPosts, isFollowingAuthor] = await Promise.all([
    getUserPosts(post.author.id, viewer.id),
    isFollowing(viewer.id, post.author.id),
  ]);
  const more = authorPosts.filter((item) => item.id !== post.id).slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-[1020px] px-3 pt-4 sm:px-5 sm:pt-6">
      <div className="mb-3 flex items-center justify-between px-1">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-[12px] font-semibold text-muted transition hover:border-brand/40 hover:text-ink"
        >
          <Icon name="arrowLeft" size={14} /> Feed
        </Link>
        <span className="text-[10.5px] uppercase tracking-[0.16em] text-muted">
          frame #{post.id}
        </span>
      </div>

      <PostCard post={post} viewer={viewer} variant="detail" />

      <section className="mt-4 rounded-2xl border border-line bg-paper p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link href={`/u/${post.author.username}`} className="shrink-0">
            <Avatar src={post.author.avatarUrl} alt={post.author.displayName} size={44} ring />
          </Link>
          <div className="min-w-0 flex-1">
            <Link
              href={`/u/${post.author.username}`}
              className="block truncate text-[13px] font-semibold hover:text-brand"
            >
              {post.author.username}
            </Link>
            <p className="truncate text-[11.5px] text-muted">
              {post.author.displayName}
              {post.location ? ` · ${post.location}` : ""}
            </p>
          </div>
          {post.author.id === viewer.id ? (
            <Link
              href="/create"
              className="rounded-xl border border-line px-3.5 py-2 text-[12px] font-semibold transition hover:border-brand/40 hover:text-brand"
            >
              Share another
            </Link>
          ) : (
            <FollowButton
              targetUserId={post.author.id}
              initialFollowing={isFollowingAuthor}
            />
          )}
        </div>
      </section>

      {more.length > 0 ? (
        <section className="mt-6 pb-8">
          <div className="mb-2 flex items-center justify-between px-1">
            <h2 className="font-display text-[20px] tracking-tight">
              More from {post.author.username}
            </h2>
            <Link
              href={`/u/${post.author.username}`}
              className="flex items-center gap-1 text-[11.5px] font-semibold text-muted hover:text-brand"
            >
              All {compactNumber(authorPosts.length)} frames <Icon name="arrowRight" size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {more.map((item) => (
              <Link
                key={item.id}
                href={`/p/${item.id}`}
                className="group relative overflow-hidden rounded-lg bg-sand"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.caption || `Photo by ${item.author.username}`}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.03] group-hover:brightness-90"
                />
                <span className="absolute inset-0 flex items-center justify-center gap-1.5 bg-ink/40 text-[12px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
                  <Icon name="heart" size={14} filled /> {item.likeCount}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <div className="pb-8" />
      )}
    </div>
  );
}
