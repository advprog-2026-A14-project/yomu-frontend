"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpenText, LogOut, Medal, Shield, Trophy, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { logout, me, type User } from "@/src/lib/api/auth";
import { getUserTier, type UserTier } from "@/src/lib/api/league";

const navItems = [
  { href: "/bacaankuis", label: "Bacaan & Kuis", icon: BookOpenText, detail: "Artikel, soal, submit score" },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy, detail: "Peringkat clan per tier" },
  { href: "/clans", label: "Clan", icon: UsersRound, detail: "Buat, join, dan lihat clan" },
  { href: "/missions", label: "Missions", icon: Medal, detail: "Target belajar aktif" },
  { href: "/achievements", label: "Achievements", icon: Shield, detail: "Badge progres user" },
];

export default function AppPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tier, setTier] = useState<UserTier | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      const result = await me();

      if (!active) {
        return;
      }

      if (result.response.success && "data" in result.response && result.response.data) {
        if (result.response.data.role === "ADMIN") {
          router.replace("/admin");
          return;
        }

        setUser(result.response.data);
        const tierResult = await getUserTier(result.response.data.user_id);

        if (active && tierResult.success && "data" in tierResult && tierResult.data) {
          setTier(tierResult.data);
        }

        if (active) {
          setLoading(false);
        }
        return;
      }

      if (result.status === 401 || result.status === 403) {
        router.replace("/auth/login");
        return;
      }

      setError(result.response.message);
      setLoading(false);
    };

    checkSession();

    return () => {
      active = false;
    };
  }, [router]);

  const onLogout = async () => {
    setLoggingOut(true);
    await logout();
    router.replace("/auth/login");
  };

  if (loading) {
    return <main className="min-h-screen bg-zinc-50 p-6 text-sm text-zinc-500">Memuat data...</main>;
  }

  if (error) {
    return <main className="min-h-screen bg-zinc-50 p-6 text-sm text-red-600">{error}</main>;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f7f8f4] text-zinc-950">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-6 md:px-8">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_24px_70px_-48px_rgba(39,63,49,0.45)] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-zinc-500">Halo, {user.username}</p>
            <h1 className="mt-1 text-3xl font-semibold md:text-4xl">{user.display_name}</h1>
            <p className="mt-2 text-sm text-zinc-500">
              {tier?.clan_name ? `${tier.clan_name} - ${tier.tier ?? "Tanpa tier"}` : "Belum tergabung ke clan"}
            </p>
          </div>
          <Button type="button" variant="outline" className="rounded-full" onClick={onLogout} disabled={loggingOut}>
            <LogOut className="size-4" />
            {loggingOut ? "Logout..." : "Logout"}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href} className="group block">
                <Card className="h-full border-black/5 bg-white transition-transform hover:-translate-y-1">
                  <CardContent className="space-y-4 p-5">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-zinc-950 text-white">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{item.label}</p>
                      <p className="mt-1 text-sm leading-6 text-zinc-500">{item.detail}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_0.7fr]">
          <Card className="border-black/5 bg-white">
            <CardContent className="space-y-4 p-6">
              <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">Alur aktif</p>
              <h2 className="text-2xl font-semibold">Bacaan, kuis, forum, dan leaderboard tersambung lewat BFF.</h2>
              <p className="text-sm leading-7 text-zinc-600">
                Token auth disimpan sebagai cookie httpOnly. Page yang perlu data privat memanggil `/api/v1/...`,
                lalu BFF meneruskan Bearer token ke Java Core atau Rust Engine.
              </p>
              <Button asChild className="rounded-full bg-zinc-950 text-white hover:bg-zinc-800">
                <Link href="/bacaankuis">Mulai membaca</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-black/5 bg-zinc-950 text-white">
            <CardContent className="space-y-4 p-6">
              <p className="text-xs tracking-[0.18em] text-zinc-400 uppercase">Status league</p>
              <div>
                <p className="text-3xl font-semibold">{tier?.tier ?? "No clan"}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {tier?.clan_name ?? "Buat atau join clan agar score quiz bisa muncul dalam kompetisi tier."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
