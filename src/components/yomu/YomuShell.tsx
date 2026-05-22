import Link from "next/link";
import type { ReactNode } from "react";
import { BookOpenText, Shield, Sparkles } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { LogoutNavButton } from "@/src/components/yomu/LogoutNavButton";

type NavItem = {
  href: string;
  label: string;
};

const learnerNav: NavItem[] = [
  { href: "/app", label: "Dashboard" },
  { href: "/bacaankuis", label: "Bacaan" },
  { href: "/clans", label: "Clan" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/profile", label: "Profil" },
];

const adminNav: NavItem[] = [
  { href: "/admin", label: "Admin" },
  { href: "/admin/articles", label: "Konten" },
  { href: "/admin/sync", label: "Sync" },
  { href: "/admin/achievements", label: "Achievement" },
  { href: "/admin/missions", label: "Misi" },
];

type Props = {
  children: ReactNode;
  mode?: "public" | "learner" | "admin";
};

export function YomuShell({ children, mode = "learner" }: Props) {
  const nav = mode === "admin" ? adminNav : learnerNav;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#f6f7fb_40%,_#fff7ed_100%)] text-zinc-950">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/86 backdrop-blur">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-col gap-3 px-5 py-3 md:flex-row md:items-center md:justify-between md:px-8 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-indigo-700 text-white">
              <BookOpenText className="size-5" />
            </span>
            <span>
              <span className="block text-base font-semibold leading-tight">Yomu</span>
              <span className="block text-xs text-zinc-500">Literasi berbasis liga</span>
            </span>
          </Link>

          {mode === "public" ? (
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="ghost" className="rounded-full">
                <Link href="/bacaankuis">Katalog</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild className="rounded-full bg-zinc-950 text-white hover:bg-zinc-800">
                <Link href="/auth/register">Mulai</Link>
              </Button>
            </div>
          ) : (
            <nav className="flex max-w-full items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex min-h-9 shrink-0 items-center rounded-full border border-zinc-200 bg-white px-4 text-sm text-zinc-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-800"
                >
                  {item.label}
                </Link>
              ))}
              {mode === "admin" ? (
                <span className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-full bg-zinc-950 px-4 text-sm text-white">
                  <Shield className="size-4" />
                  Admin
                </span>
              ) : (
                <span className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-full bg-amber-50 px-4 text-sm text-amber-800">
                  <Sparkles className="size-4" />
                  Pelajar
                </span>
              )}
              <LogoutNavButton />
            </nav>
          )}
        </div>
      </header>
      {children}
    </main>
  );
}
