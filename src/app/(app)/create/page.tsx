import { CreatePostForm } from "@/components/create-post-form";
import { Icon } from "@/components/icons";
import { requireUser } from "@/lib/auth";
import { createGallery } from "@/lib/media";

export const dynamic = "force-dynamic";

export const metadata = { title: "New post" };

export default async function CreatePage() {
  const user = await requireUser();

  return (
    <div className="mx-auto w-full max-w-[1000px] px-3 pt-5 sm:px-5 sm:pt-7">
      <div className="mb-4 px-1">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
          <Icon name="plus" size={13} /> new frame
        </p>
        <h1 className="mt-1 font-display text-[30px] leading-none tracking-tight sm:text-[36px]">
          Publish a photo
        </h1>
        <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted">
          Choose a frame from the library or paste your own image URL, then write a caption worth
          reading.
        </p>
      </div>

      <CreatePostForm viewer={user} gallery={createGallery} />
    </div>
  );
}
