import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { Icon, type IconName } from "@/components/icons";
import { requireUser } from "@/lib/auth";
import { timeAgo } from "@/lib/format";
import { getActivity } from "@/lib/queries";
import type { ActivityView } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = { title: "Activity" };

const kindMeta: Record<ActivityView["kind"], { icon: IconName; badge: string }> = {
  like: { icon: "heart", badge: "bg-brand text-white" },
  comment: { icon: "comment", badge: "bg-forest text-white" },
  follow: { icon: "user", badge: "bg-sand text-ink" },
};

function description(item: ActivityView) {
  if (item.kind === "like") return "liked your frame";
  if (item.kind === "comment") return "commented on your frame";
  return "started following you";
}

export default async function ActivityPage() {
  const user = await requireUser();
  const activity = await getActivity(user.id);

  const today = activity.slice(0, 8);
  const earlier = activity.slice(8);

  function renderRow(item: ActivityView) {
    const meta = kindMeta[item.kind];
    const href = item.postId ? `/p/${item.postId}` : `/u/${item.actor.username}`;
    return (
      <li key={item.key}>
        <Link
          href={href}
          className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-sand/40"
        >
          <span className="relative shrink-0">
            <Avatar src={item.actor.avatarUrl} alt={item.actor.displayName} size={44} />
            <span
              className={`absolute -bottom-1 -right-1 grid h-[21px] w-[21px] place-items-center rounded-full ring-2 ring-paper ${meta.badge}`}
            >
              <Icon name={meta.icon} size={11} filled={item.kind === "like"} />
            </span>
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-[13px] leading-snug">
              <span className="font-semibold">{item.actor.username}</span>{" "}
              <span className="text-ink/80">{description(item)}</span>
            </p>
            {item.body ? (
              <p className="mt-0.5 truncate text-[12px] text-muted">&ldquo;{item.body}&rdquo;</p>
            ) : null}
            <p className="mt-1 text-[10.5px] uppercase tracking-[0.12em] text-muted/80">
              {timeAgo(item.createdAt)} ago
            </p>
          </div>

          {item.postImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.postImage}
              alt=""
              className="h-11 w-11 shrink-0 rounded-lg object-cover"
            />
          ) : null}
        </Link>
      </li>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[640px] px-3 pt-5 sm:px-5 sm:pt-7">
      <div className="px-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
          the room is reacting
        </p>
        <h1 className="mt-1 font-display text-[30px] leading-none tracking-tight sm:text-[36px]">
          Activity
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          Likes, comments, and new followers on the frames you shared.
        </p>
      </div>

      {activity.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-line bg-paper px-6 py-16 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sand text-brand">
            <Icon name="bell" size={26} />
          </span>
          <h2 className="mt-4 font-display text-2xl">All quiet for now</h2>
          <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-muted">
            When someone likes, comments, or follows, it will show up here.
          </p>
          <Link
            href="/create"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            <Icon name="plus" size={16} /> Share a frame
          </Link>
        </div>
      ) : (
        <div className="mt-5 space-y-5 pb-8">
          {today.length > 0 ? (
            <section className="overflow-hidden rounded-2xl border border-line bg-paper">
              <h2 className="border-b border-line px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                Latest
              </h2>
              <ul className="divide-y divide-line/70 p-1.5">{today.map(renderRow)}</ul>
            </section>
          ) : null}

          {earlier.length > 0 ? (
            <section className="overflow-hidden rounded-2xl border border-line bg-paper">
              <h2 className="border-b border-line px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                Earlier
              </h2>
              <ul className="divide-y divide-line/70 p-1.5">{earlier.map(renderRow)}</ul>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
