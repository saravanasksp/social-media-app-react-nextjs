import Link from "next/link";
import { demoSignInAction } from "@/app/actions";
import { AuthForm } from "@/components/auth-form";
import { Wordmark } from "@/components/brand";
import { Icon } from "@/components/icons";
import { DEMO_CREDENTIALS } from "@/db/seed";
import { photos } from "@/lib/media";

export const dynamic = "force-dynamic";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[1.05fr_minmax(420px,0.95fr)]">
      <section className="relative hidden overflow-hidden bg-ink lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0">
          <div className="grid h-full grid-cols-2 grid-rows-3 gap-1.5 opacity-90">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos.cliff} alt="" className="h-full w-full object-cover" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos.bedroom} alt="" className="h-full w-full object-cover" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos.stockholm} alt="" className="h-full w-full object-cover" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos.waves} alt="" className="h-full w-full object-cover" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos.market} alt="" className="h-full w-full object-cover" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos.peak} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/25" />
        </div>

        <div className="relative z-10 p-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-ink/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-cream/80 backdrop-blur">
            <Icon name="sparkles" size={13} /> a quieter social network
          </span>
        </div>

        <div className="relative z-10 max-w-[520px] p-10 pt-0">
          <div className="mb-6 text-cream">
            <Wordmark size={30} />
          </div>
          <h1 className="font-display text-[44px] leading-[1.05] tracking-tight text-cream">
            Share the light
            <br />
            you see.
          </h1>
          <p className="mt-4 max-w-[420px] text-[14px] leading-relaxed text-cream/75">
            Vignette is a photo-first home for the frames you would have scrolled past. Coastlines,
            quiet corners, city textures, and the people noticing them.
          </p>
          <ul className="mt-7 space-y-2.5 text-[13px] text-cream/80">
            {[
              "A chronological feed of people you actually follow",
              "Collect frames into your own saved light",
              "Stories that stay up for a day, not forever",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-cream/15 text-cream">
                  <Icon name="check" size={12} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="flex min-h-screen flex-col justify-center px-5 py-10 sm:px-10 lg:px-14">
        <div className="mx-auto w-full max-w-[400px]">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Wordmark size={24} />
            <span className="rounded-full bg-sand px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
              beta
            </span>
          </div>

          <div className="hidden lg:block">
            <div className="mb-8">
              <Wordmark size={26} />
            </div>
          </div>

          <h2 className="font-display text-[34px] leading-tight tracking-tight">Welcome back</h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
            Sign in to pick up where the light left off.
          </p>

          <div className="mt-7">
            <AuthForm mode="signin" />
          </div>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-line" />
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted">
              or
            </span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <form action={demoSignInAction}>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-paper px-4 py-3 text-[13.5px] font-semibold text-ink transition hover:border-brand/40 hover:bg-white"
            >
              <Icon name="sparkles" size={16} className="text-brand" />
              Enter the demo studio
            </button>
          </form>

          <p className="mt-3 rounded-xl bg-sand/70 px-3.5 py-2.5 text-[11.5px] leading-relaxed text-muted">
            Demo account:{" "}
            <span className="font-semibold text-ink">{DEMO_CREDENTIALS.username}</span> ·{" "}
            <span className="font-semibold text-ink">{DEMO_CREDENTIALS.password}</span> — the demo
            studio signs you in instantly.
          </p>

          <p className="mt-6 text-center text-[13px] text-muted">
            New here?{" "}
            <Link href="/signup" className="font-semibold text-brand hover:text-brand-dark">
              Create an account
            </Link>
          </p>

          <p className="mt-8 text-center text-[10.5px] uppercase tracking-[0.16em] text-muted/70">
            © 2026 Vignette · made for the light
          </p>
        </div>
      </section>
    </div>
  );
}
