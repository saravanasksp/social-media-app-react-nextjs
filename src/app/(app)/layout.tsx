import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { ensureSeeded } from "@/db/seed";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: ReactNode }) {
  await ensureSeeded();
  const user = await requireUser();

  return <AppShell user={user}>{children}</AppShell>;
}
