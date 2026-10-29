import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/avatar";
import { FollowButton } from "@/components/follow-button";
import { Icon } from "@/components/icons";
import { PostGrid } from "@/components/post-grid";
import { requireUser } from "@/lib/auth";
import { joinedDate } from "@/lib/format";
import { getProfile, getSavedPosts, getUserPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default async function ProfilePage({ params, searchParams }: Props) {
  const viewer = await requireUser();
  const { username } = await params;
  const { tab } = await searchParams;

  const profile = await getProfile(username, viewer.id);
  if (!profile) notFound();

  const activeTab = tab === "saved" && profile.isMe ? "saved" : "posts";
  const posts =
    activeTab === "saved"
      ? await getSavedPosts(viewer.id)
      : await getUserPosts(profile.user.id, viewer.id);

  const website = profile.user.website;
  const websiteHref = website
    ? website.startsWith("http")
      ? website
      : `https://${website}`
    : null;

  return (
    <div className="mx-auto w-full max-w-[935px] px-3 pt-5 sm:px-5 sm:pt-7">
      <header className="rounded-3xl border border-line bg-paper p-4 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:gap-8">
          <div className="flex items-center gap-4 sm:block">
            <Avatar
              src={profile.user.avatarUrl}
              alt={profile.user.displayName}
              size={84}
              ring
              className="sm:hidden"
            />
            <Avatar
              src={profile.user.avatarUrl}
              alt={profile.user.displayName}
              size={148}
              ring
              className="hidden sm:block"
            />
            <div className="min-w-0 sm:hidden">
              <h1 className="truncate font-display text-[24px] leading-none tracking-tight">
                {profile.user.username}
              </h1>
              <p className="mt-1 truncate text-[12.5px] text-muted">{profile.user.displayName}</p>
              {profile.user.location ? (
                <p className="mt-1 flex items-center gap-1 text-[11.5px] text-muted">
                  <Icon name="mapPin" size={12} /> {profile.user.location}
                </p>
              ) : null}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="hidden flex-wrap items-center gap-2.5 sm:flex">
              <h1 className="font-display text-[28px] leading-none tracking-tight">
                {profile.user.username}
              </h1>
              {profile.isMe ? (
                <>
                  <Link
                    href="/settings"
                    className="rounded-xl border border-line bg-white px-3.5 py-1.5 text-[12.5px] font-semibold transition hover:border-brand/40 hover:text-brand"
                  >
                    Edit profile
                  </Link>
                  <Link
                    href="/create"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3.5 py-1.5 text-[12.5px] font-semibold text-white transition hover:bg-brand-dark"
                  >
                    <Icon name="plus" size={14} /> New post
                  </Link>
                  <Link
                    href="/settings"
                    aria-label="Settings"
                    className="rounded-lg border border-line bg-white p-1.5 text-muted transition hover:text-ink"
                  >
                    <Icon name="settings" size={16} />
                  </Link>
                </>
              ) : (
                <>
                  <FollowButton
                    targetUserId={profile.user.id}
                    initialFollowing={profile.isFollowedByMe}
                  />
                  <span className="rounded-xl border border-line bg-sand/50 px-3.5 py-2 text-[12px] font-medium text-muted">
                    {profile.followerCount} followers
                  </span>
                </>
              )}
            </div>

            <div className="mt-3 flex gap-6 text-[13px] sm:mt-5 sm:gap-8">
              <span>
                <strong className="font-semibold tabular-nums">{profile.postCount}</strong>{" "}
                <span className="text-muted">posts</span>
              </span>
              <span>
                <strong className="font-semibold tabular-nums">{profile.followerCount}</strong>{" "}
                <span className="text-muted">followers</span>
              </span>
              <span>
                <strong className="font-semibold tabular-nums">{profile.followingCount}</strong>{" "}
                <span className="text-muted">following</span>
              </span>
            </div>

            <div className="mt-4 hidden sm:block">
              <p className="text-[13.5px] font-semibold">{profile.user.displayName}</p>
              {profile.user.bio ? (
                <p className="mt-1 whitespace-pre-line text-[13px] leading-relaxed text-ink/85">
                  {profile.user.bio}
                </p>
              ) : (
                <p className="mt-1 text-[13px] text-muted">No bio yet.</p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px]">
                {websiteHref ? (
                  <a
                    href={websiteHref}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 font-semibold text-brand hover:text-brand-dark"
                  >
                    <Icon name="globe" size={13} />
                    {website}
                  </a>
                ) : null}
                {profile.user.location ? (
                  <span className="inline-flex items-center gap-1.5 text-muted">
                    <Icon name="mapPin" size={13} /> {profile.user.location}
                  </span>
                ) : null}
                <span className="text-muted">Joined {joinedDate(profile.user.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:hidden">
          <p className="text-[13px] font-semibold">{profile.user.displayName}</p>
          {profile.user.bio ? (
            <p className="mt-1 whitespace-pre-line text-[12.5px] leading-relaxed text-ink/85">
              {profile.user.bio}
            </p>
          ) : null}
          {websiteHref ? (
            <a
              href={websiteHref}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-1.5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-brand"
            >
              <Icon name="globe" size={12} /> {website}
            </a>
          ) : null}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {profile.isMe ? (
              <>
                <Link
                  href="/settings"
                  className="flex-1 rounded-xl border border-line bg-white px-3 py-2 text-center text-[12.5px] font-semibold"
                >
                  Edit profile
                </Link>
                <Link
                  href="/create"
                  className="flex-1 rounded-xl bg-brand px-3 py-2 text-center text-[12.5px] font-semibold text-white"
                >
                  New post
                </Link>
              </>
            ) : (
              <FollowButton
                targetUserId={profile.user.id}
                initialFollowing={profile.isFollowedByMe}
                fullWidth
              />
            )}
          </div>
        </div>
      </header>

      <div className="mt-4 flex items-center justify-center gap-1 border-b border-line">
        <Link
          href={`/u/${profile.user.username}`}
          className={`flex items-center gap-1.5 border-b-2 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] transition ${
            activeTab === "posts"
              ? "border-ink text-ink"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          <Icon name="grid" size={14} /> Posts
        </Link>
        {profile.isMe ? (
          <Link
            href={`/u/${profile.user.username}?tab=saved`}
            className={`flex items-center gap-1.5 border-b-2 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] transition ${
              activeTab === "saved"
                ? "border-ink text-ink"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            <Icon name="bookmark" size={14} filled={activeTab === "saved"} /> Saved
          </Link>
        ) : null}
      </div>

      <div className="mt-3 pb-8">
        {activeTab === "saved" ? (
          <PostGrid
            posts={posts}
            emptyTitle="Your saved shelf is empty"
            emptyBody="Bookmark frames from the grid and they'll be waiting here."
            emptyAction={{ href: "/explore", label: "Browse the grid" }}
          />
        ) : (
          <PostGrid
            posts={posts}
            emptyTitle={profile.isMe ? "Your first frame awaits" : "No posts yet"}
            emptyBody={
              profile.isMe
                ? "Share a photo from your day and it will live here."
                : `${profile.user.displayName} hasn't shared a frame yet.`
            }
            emptyAction={profile.isMe ? { href: "/create", label: "Create a post" } : undefined}
          />
        )}
      </div>
    </div>
  );
}
