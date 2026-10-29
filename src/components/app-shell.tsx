"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { signOutAction } from "@/app/actions";
import type { SessionUser } from "@/lib/types";
import { Avatar } from "./avatar";
import { LogoMark, Wordmark } from "./brand";
import { Icon, type IconName } from "./icons";

type Props = {
  user: SessionUser;
  children: ReactNode;
};

type NavItem = { href: string; label: string; icon: IconName };

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/explore", label: "Explore", icon: "compass" },
  { href: "/create", label: "Create", icon: "plus" },
  { href: "/notifications", label: "Activity", icon: "bell" },
  { href: "/saved", label: "Saved", icon: "bookmark" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ user, children }: Props) {
  const pathname = usePathname();
  const profileHref = `/u/${user.username}`;
  const profileActive = pathname.startsWith("/u/") && pathname === profileHref;

  return (
    <div className="min-h-screen lg:pl-[248px]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-line bg-cream/80 px-4 py-6 backdrop-blur lg:flex">
        <Link href="/" className="mb-8 px-3" aria-label="Vignette home">
          <Wordmark size={26} />
        </Link>

        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-[15px] transition ${
                  active
                    ? "bg-white font-semibold text-ink shadow-[0_1px_2px_rgba(29,25,22,0.06)]"
                    : "text-muted hover:bg-white/60 hover:text-ink"
                }`}
              >
                <span className={active ? "text-brand" : "text-ink/70 group-hover:text-ink"}>
                  <Icon name={item.icon} size={23} filled={active && item.href === "/saved"} />
                </span>
                {item.label}
                {item.href === "/create" ? (
                  <span className="ml-auto rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-dark">
                    new
                  </span>
                ) : null}
              </Link>
            );
          })}

          <Link
            href={profileHref}
            className={`group flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-[15px] transition ${
              profileActive
                ? "bg-white font-semibold text-ink shadow-[0_1px_2px_rgba(29,25,22,0.06)]"
                : "text-muted hover:bg-white/60 hover:text-ink"
            }`}
          >
            <Avatar src={user.avatarUrl} alt={user.displayName} size={23} />
            Profile
          </Link>
        </nav>

        <div className="mt-6 rounded-2xl border border-line bg-gradient-to-br from-white via-paper to-sand p-4">
          <p className="flex items-center gap-1.5 font-display text-[15px] leading-tight">
            <Icon name="sparkles" size={16} className="text-brand" />
            Find your light
          </p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
            Follow makers and photographers who share the way you see the world.
          </p>
          <Link
            href="/explore"
            className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-brand hover:text-brand-dark"
          >
            Explore the grid
            <Icon name="arrowRight" size={14} />
          </Link>
        </div>

        <div className="mt-auto pt-6">
          <Link
            href={profileHref}
            className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-white/60"
          >
            <Avatar src={user.avatarUrl} alt={user.displayName} size={38} ring />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{user.username}</span>
              <span className="block truncate text-[12px] text-muted">{user.displayName}</span>
            </span>
          </Link>
          <div className="mt-1 flex items-center justify-between px-2">
            <Link
              href="/settings"
              className="flex items-center gap-1.5 text-[12px] text-muted transition hover:text-ink"
            >
              <Icon name="settings" size={14} />
              Settings
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="flex items-center gap-1.5 text-[12px] text-muted transition hover:text-brand"
              >
                <Icon name="logout" size={14} />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-cream/90 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/" aria-label="Vignette home">
          <Wordmark size={22} />
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/search"
            className="rounded-full p-2 text-ink transition hover:bg-sand"
            aria-label="Search"
          >
            <Icon name="search" size={21} />
          </Link>
          <Link
            href="/notifications"
            className="relative rounded-full p-2 text-ink transition hover:bg-sand"
            aria-label="Activity"
          >
            <Icon name="bell" size={21} />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand" />
          </Link>
          <Link
            href="/create"
            className="rounded-full bg-brand p-2 text-white transition hover:bg-brand-dark"
            aria-label="Create post"
          >
            <Icon name="plus" size={19} />
          </Link>
        </div>
      </header>

      <main className="pb-24 lg:pb-12">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-line bg-cream/95 px-2 py-2 backdrop-blur lg:hidden">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-4 py-1.5 ${
                active ? "text-brand" : "text-ink/60"
              }`}
            >
              <Icon
                name={item.icon}
                size={22}
                filled={active && (item.href === "/saved" || item.href === "/")}
              />
              <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
            </Link>
          );
        })}
        <Link
          href={profileHref}
          aria-label="Your profile"
          className={`flex flex-col items-center gap-0.5 rounded-xl px-4 py-1.5 ${
            profileActive ? "text-brand" : "text-ink/60"
          }`}
        >
          <Avatar src={user.avatarUrl} alt={user.displayName} size={22} />
          <span className="text-[10px] font-medium tracking-wide">You</span>
        </Link>
      </nav>

      <Link
        href="/create"
        className="fixed bottom-24 right-4 z-20 hidden items-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark sm:flex lg:hidden"
      >
        <LogoMark size={18} />
        New post
      </Link>
    </div>
  );
}
