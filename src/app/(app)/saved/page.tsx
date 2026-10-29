import { Icon } from "@/components/icons";
import { PostGrid } from "@/components/post-grid";
import { requireUser } from "@/lib/auth";
import { getSavedPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "Saved" };

export default async function SavedPage() {
  const user = await requireUser();
  const posts = await getSavedPosts(user.id);

  return (
    <div className="mx-auto w-full max-w-[935px] px-3 pt-5 sm:px-5 sm:pt-7">
      <div className="px-1">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
          <Icon name="bookmark" size={13} filled /> your collection
        </p>
        <h1 className="mt-1 font-display text-[30px] leading-none tracking-tight sm:text-[36px]">
          Saved frames
        </h1>
        <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-muted">
          A private shelf of the photographs you want to come back to. Only you can see what lands
          here.
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between px-1">
        <h2 className="font-display text-[20px] tracking-tight">All saved</h2>
        <span className="text-[11px] uppercase tracking-[0.14em] text-muted">
          {posts.length} {posts.length === 1 ? "frame" : "frames"}
        </span>
      </div>

      <div className="mt-3 pb-6">
        <PostGrid
          posts={posts}
          emptyTitle="Nothing saved yet"
          emptyBody="Tap the bookmark on any photo and it will wait for you here."
          emptyAction={{ href: "/explore", label: "Find something to save" }}
        />
      </div>
    </div>
  );
}
