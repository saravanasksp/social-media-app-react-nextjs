import Link from "next/link";
import { signOutAction } from "@/app/actions";
import { Icon } from "@/components/icons";
import { SettingsForm } from "@/components/settings-form";
import { requireUser } from "@/lib/auth";
import { joinedDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="mx-auto w-full max-w-[720px] px-3 pt-5 sm:px-5 sm:pt-7">
      <div className="px-1">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
          <Icon name="settings" size={13} /> your corner
        </p>
        <h1 className="mt-1 font-display text-[30px] leading-none tracking-tight sm:text-[36px]">
          Settings
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          Tune how your profile reads and how your frames are credited.
        </p>
      </div>

      <section className="mt-5 rounded-2xl border border-line bg-paper p-4 sm:p-5">
        <h2 className="mb-4 font-display text-[20px] tracking-tight">Edit profile</h2>
        <SettingsForm viewer={user} />
      </section>

      <section className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-paper p-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            Account
          </h2>
          <dl className="mt-2.5 space-y-1.5 text-[12.5px]">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">Email</dt>
              <dd className="truncate font-medium">{user.email}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">Joined</dt>
              <dd className="font-medium">{joinedDate(user.createdAt)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted">Profile</dt>
              <dd>
                <Link
                  href={`/u/${user.username}`}
                  className="font-semibold text-brand hover:text-brand-dark"
                >
                  @{user.username}
                </Link>
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-line bg-paper p-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            Session
          </h2>
          <p className="mt-2.5 text-[12.5px] leading-relaxed text-muted">
            You&apos;re signed in with a secure, http-only session cookie that lasts 30 days.
          </p>
          <form action={signOutAction} className="mt-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2 text-[12.5px] font-semibold transition hover:border-brand/40 hover:text-brand"
            >
              <Icon name="logout" size={15} /> Sign out
            </button>
          </form>
        </div>
      </section>

      <div className="mt-4 rounded-2xl border border-dashed border-line bg-sand/40 p-4 text-[11.5px] leading-relaxed text-muted">
        <span className="font-semibold text-ink">A small note:</span> Vignette stores image links,
        not uploads. If you swap an avatar URL and it breaks, paste a direct image link (ending in
        .jpg or .png) or use one of the studio portraits.
      </div>
    </div>
  );
}
