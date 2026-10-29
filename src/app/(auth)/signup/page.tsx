import Link from "next/link";
import { demoSignInAction } from "@/app/actions";
import { AuthForm } from "@/components/auth-form";
import { Wordmark } from "@/components/brand";
import { Icon } from "@/components/icons";
import { photos } from "@/lib/media";

export const dynamic = "force-dynamic";

export const metadata = { title: "Join Vignette" };

export default function SignUpPage() {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[1.05fr_minmax(420px,0.95fr)]">
      <section className="relative hidden overflow-hidden bg-forest lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos.plantDoor} alt="" className="h-full w-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/55 to-forest/10" />
        </div>

        <div className="relative z-10 p-10 text-cream">
          <Wordmark size={30} />
        </div>

        <div className="relative z-10 max-w-[500px] p-10 pt-0 text-cream">
          <h1 className="font-display text-[42px] leading-[1.07] tracking-tight">
            Make your corner
            <br />
            of the internet warmer.
          </h1>
          <p className="mt-4 max-w-[400px] text-[14px] leading-relaxed text-cream/80">
            No reels autoplaying, no shouting. Just photographs, short notes, and the people whose
            eye you trust.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-2">
            {[photos.succulents, photos.pier, photos.latteArt].map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt=""
                className="aspect-square w-full rounded-xl object-cover ring-1 ring-cream/20"
              />
            ))}
          </div>

          <p className="mt-6 flex items-center gap-2 text-[11.5px] uppercase tracking-[0.14em] text-cream/60">
            <Icon name="globe" size={14} /> join 8 working photographers
          </p>
        </div>
      </section>

      <section className="flex min-h-screen flex-col justify-center px-5 py-10 sm:px-10 lg:px-14">
        <div className="mx-auto w-full max-w-[400px]">
          <div className="mb-8 lg:hidden">
            <Wordmark size={24} />
          </div>
          <div className="mb-8 hidden lg:block">
            <Wordmark size={26} />
          </div>

          <h2 className="font-display text-[34px] leading-tight tracking-tight">Create your account</h2>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
            Pick a username and start collecting frames.
          </p>

          <div className="mt-7">
            <AuthForm mode="signup" />
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
              Look around the demo studio
            </button>
          </form>

          <p className="mt-6 text-center text-[13px] text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand hover:text-brand-dark">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
