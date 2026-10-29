import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Vignette — share the light",
    template: "%s · Vignette",
  },
  description:
    "Vignette is a warm, photo-first social network for photographers, makers, and everyday observers. Share frames, collect moments, follow the light.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream text-ink antialiased">{children}</body>
    </html>
  );
}
