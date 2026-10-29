import Link from "next/link";
import { Wordmark } from "@/components/brand";
import { Icon } from "@/components/icons";
import { photos } from "@/lib/media";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-5 py-12">
      <div className="w-full max-w-[460px] overflow-hidden rounded-3xl border border-line bg-paper shadow-[0_20px_60px_rgba(29,25,22,0.08)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos.dusk}
          alt=""
          className="h-40 w-full object-cover"
        />
        <div className="p-6 text-center">
          <div className="flex justify-center">
            <Wordmark size={24} />
          </div>
          <h1 className="mt-5 font-display text-[28px] leading-tight tracking-tight">
            This frame went out of focus
          </h1>
          <p className="mx-auto mt-2 max-w-xs text-[13px] leading-relaxed text-muted">
            The page you were looking for isn&apos;t here. It may have been deleted or the link is
            slightly off.
          </p>
          <div className="mt-5 flex items-center justify-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-brand-dark"
            >
              <Icon name="home" size={15} /> Back to the feed
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-[13px] font-semibold transition hover:border-brand/40"
            >
              <Icon name="compass" size={15} /> Explore
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
