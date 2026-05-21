"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpenText,
  CheckCircle2,
  Crown,
  LogOut,
  Medal,
  MessageSquareText,
  Shield,
  Trophy,
  UserRound,
} from "lucide-react";

import { DashboardReadingPreview } from "@/src/components/bacaankuis/DashboardReadingPreview";
import { DashboardForumPreview } from "@/src/components/forum/DashboardForumPreview";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { logout, me, type User } from "@/src/lib/api/auth";

const quickStats = [
  {
    title: "Bacaan aktif",
    description: "Masuk ke ruang baca dan kuis dari preview dashboard.",
    icon: BookOpenText,
  },
  {
    title: "Diskusi artikel",
    description: "Setelah baca atau kuis, kamu bisa lanjut ngobrol di forum artikel terkait.",
    icon: MessageSquareText,
  },
  {
    title: "Progress belajar",
    description: "Flow baca, jawab, dan lihat hasil akhir sekarang sudah nyambung ke backend grading.",
    icon: Trophy,
  },
];

const moduleLinks = [
  {
    title: "Bacaan & Kuis",
    description: "Pilih artikel, baca sampai tuntas, lalu kerjakan kuis sekali submit.",
    href: "/bacaankuis",
    icon: BookOpenText,
    tone: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Clan",
    description: "Cek tier, buat clan, atau bergabung memakai ID clan dari teman.",
    href: "/clans",
    icon: Shield,
    tone: "bg-sky-100 text-sky-700",
  },
  {
    title: "Leaderboard",
    description: "Bandingkan performa clan per tier dari Rust Engine.",
    href: "/leaderboard",
    icon: Trophy,
    tone: "bg-amber-100 text-amber-700",
  },
  {
    title: "Achievements",
    description: "Status integrasi achievement dan rancangan tampilan profil.",
    href: "/achievements",
    icon: Medal,
    tone: "bg-violet-100 text-violet-700",
  },
  {
    title: "Daily Missions",
    description: "Status misi harian, progress, dan reward yang menunggu endpoint aktif.",
    href: "/missions",
    icon: CheckCircle2,
    tone: "bg-teal-100 text-teal-700",
  },
  {
    title: "Profil Akun",
    description: "Ubah username, display name, identifier login, dan password.",
    href: "/profile",
    icon: UserRound,
    tone: "bg-zinc-100 text-zinc-800",
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

    void checkSession();

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
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f4efe3_0%,_#f7f7f4_38%,_#eef4ef_100%)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 md:px-8 lg:px-10">
        <section className="overflow-hidden rounded-[2rem] border border-black/5 bg-white/82 shadow-[0_28px_70px_-42px_rgba(59,86,64,0.35)]">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5 border-b border-zinc-200/70 bg-[radial-gradient(circle_at_top_left,_rgba(213,247,235,0.92),_rgba(248,243,228,0.84)_42%,_rgba(255,255,255,0.95)_100%)] px-6 py-7 lg:border-r lg:border-b-0 lg:px-8 lg:py-8">
              <Badge className="w-fit bg-emerald-700 px-3 py-1 text-white">Dashboard Pelajar</Badge>
              <div className="space-y-3">
                <h1 className="max-w-3xl text-4xl leading-tight font-semibold text-zinc-950">
                  Halo, {user.display_name}
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-zinc-600 md:text-base">
                  Dashboard ini jadi tempat masuk utama untuk belajar. Dari sini kamu bisa lihat preview
                  bacaan, lanjut ke kuis, dan pindah ke diskusi artikel tanpa perlu cari-cari route sendiri.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="rounded-full bg-zinc-950 text-white hover:bg-zinc-800">
                  <a href="/bacaankuis">Mulai baca</a>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={onLogout}
                  disabled={loggingOut}
                >
                  <LogOut className="size-4" />
                  {loggingOut ? "Logout..." : "Logout"}
                </Button>
              </div>
            </div>

            <div className="grid gap-4 px-6 py-7 lg:px-8 lg:py-8">
              {quickStats.map((item) => {
                const Icon = item.icon;

                return (
                  <Card key={item.title} className="border-black/5 bg-white/82 shadow-none">
                    <CardContent className="flex items-start gap-4 p-5">
                      <div className="rounded-2xl bg-zinc-950 p-3 text-white">
                        <Icon className="size-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-zinc-950">{item.title}</p>
                        <p className="text-sm leading-6 text-zinc-600">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-black/5 bg-white/82 px-6 py-7 shadow-[0_28px_70px_-42px_rgba(59,86,64,0.28)] lg:px-8 lg:py-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-800">Ruang kerja pelajar</p>
              <h2 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950">Modul Yomu</h2>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
              <Crown className="size-3.5" />
              Clan dan liga tersambung ke Rust Engine
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {moduleLinks.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="group rounded-[1.5rem] border border-black/5 bg-white p-5 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className={`flex size-11 items-center justify-center rounded-2xl ${item.tone}`}>
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-zinc-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{item.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-900">
                    Buka modul
                    <Trophy className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </a>
              );
            })}
          </div>
        </section>

        <DashboardReadingPreview />
        <DashboardForumPreview />
      </div>
    </main>
  );
}
