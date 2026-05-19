"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpenText, LogOut, MessageSquareText, Shield, Trophy, UsersRound } from "lucide-react";

import { logout, me, type User } from "@/src/lib/api/auth";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";

const navItems = [
  {
    href: "/bacaankuis",
    title: "Bacaan & Kuis",
    description: "Buka katalog artikel, kerjakan kuis, lalu submit hasil ke Java Core.",
    icon: BookOpenText,
  },
  {
    href: "/leaderboard",
    title: "Leaderboard",
    description: "Lihat ranking clan langsung dari Rust Engine.",
    icon: Trophy,
  },
  {
    href: "/clans",
    title: "Clan",
    description: "Cek tier user dan buat clan baru jika engine sudah aktif.",
    icon: UsersRound,
  },
  {
    href: "/forums/art-eco-hutan-kota",
    title: "Forum",
    description: "Ruang diskusi artikel. Perlu penyamaan article_id sebelum production.",
    icon: MessageSquareText,
  },
];

export default function AppPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
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
        setLoading(false);
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
    return <main className="p-6">Memuat data...</main>;
  }

  if (error) {
    return <main className="p-6 text-red-600">{error}</main>;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-6 text-zinc-950 sm:px-5 md:px-8">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex min-w-0 flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 md:flex-row md:items-center md:justify-between md:p-6">
          <div className="min-w-0">
            <p className="text-sm text-zinc-500">Masuk sebagai Pelajar</p>
            <h1 className="mt-1 text-2xl font-semibold leading-tight">Halo, {user.display_name}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
              Ini sekarang menjadi hub aplikasi. Sebelumnya halaman ini hanya menampilkan welcome, sehingga
              modul lain terasa hilang walaupun route-nya sudah ada.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-auto min-h-9 whitespace-normal px-4 py-2 text-center"
            onClick={onLogout}
            disabled={loggingOut}
          >
            <LogOut className="size-4" />
            {loggingOut ? "Logout..." : "Logout"}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href} className="group block">
                <Card className="h-full border-zinc-200 bg-white transition hover:border-zinc-300">
                  <CardContent className="flex h-full min-w-0 gap-4 p-5">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-zinc-950 text-white">
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-semibold leading-tight group-hover:underline">{item.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-zinc-600">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex min-w-0 gap-3 p-5 text-sm leading-6 text-amber-950">
            <Shield className="mt-0.5 size-4 shrink-0" />
            Frontend masih perlu penyamaan kontrak `article_id` untuk forum/quiz dan jawaban benar quiz dari
            backend agar submit score bisa sepenuhnya berasal dari data Java.
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
