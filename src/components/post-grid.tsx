import Link from "next/link";
import { compactNumber } from "@/lib/format";
import type { PostView } from "@/lib/types";
import { Icon } from "./icons";

type Props = {
  posts: PostView[];
  emptyTitle?: string;
  emptyBody?: string;
  emptyAction?: { href: string; label: string };
};

export function PostGrid({ posts, emptyTitle, emptyBody, emptyAction }: Props) {
  if (posts.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-line bg-paper/70 px-6 py-16 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sand text-brand">
          <Icon name="camera" size={26} />
        </span>
        <h3 className="mt-4 font-display text-2xl">{emptyTitle ?? "Nothing here yet"}</h3>
        <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-muted">
          {emptyBody ?? "When frames land here, they'll show up in this grid."}
        </p>
        {emptyAction ? (
          <Link
            href={emptyAction.href}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            <Icon name="plus" size={16} />
            {emptyAction.label}
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/p/${post.id}`}
          className="group relative overflow-hidden rounded-[4px] bg-sand sm:rounded-md"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.imageUrl}
            alt={post.caption || `Photo by ${post.author.username}`}
            loading="lazy"
            className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.04] group-hover:brightness-90"
          />
          <span className="absolute inset-0 flex items-center justify-center gap-4 bg-ink/45 opacity-0 transition group-hover:opacity-100">
            <span className="flex items-center gap-1.5 text-[13px] font-semibold text-white">
              <Icon name="heart" size={17} filled /> {compactNumber(post.likeCount)}
            </span>
            <span className="flex items-center gap-1.5 text-[13px] font-semibold text-white">
              <Icon name="comment" size={17} filled /> {compactNumber(post.commentCount)}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}
