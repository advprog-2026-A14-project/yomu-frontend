"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpenText,
  CheckCircle2,
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
import { ModuleCard } from "@/src/components/yomu/ModuleCard";
import { YomuShell } from "@/src/components/yomu/YomuShell";
import { logout, me, type User } from "@/src/lib/api/auth";

const quickStats = [
  {
    title: "Bacaan aktif",
    description: "Masuk ke ruang baca dan kuis dari preview dashboard.",
    icon: BookOpenText,
  },
  {
    title: "Diskusi artikel",
    description: "Lanjut ngobrol di forum setelah membaca atau mengerjakan kuis.",
    icon: MessageSquareText,
  },
  {
    title: "Liga clan",
    description: "Skor kuis ikut menopang perjalanan clan di papan peringkat.",
    icon: Trophy,
  },
];

const modules = [
  {
    title: "Bacaan & Kuis",
    description: "Pilih artikel, baca sampai tuntas, lalu submit jawaban kuis sekali.",
    href: "/bacaankuis",
    icon: BookOpenText,
    tone: "bg-indigo-50 text-indigo-700",
  },
  {
    title: "Clan",
    description: "Buat clan, cek tier user, atau buka detail anggota clan.",
    href: "/clans",
    icon: Shield,
    tone: "bg-sky-50 text-sky-700",
  },
  {
    title: "Leaderboard",
    description: "Lihat ranking clan per tier Bronze, Silver, Gold, dan Diamond.",
    href: "/leaderboard",
    icon: Trophy,
    tone: "bg-amber-50 text-amber-700",
  },
  {
    title: "Profil",
    description: "Kelola username, display name, email, nomor HP, password, dan akun.",
    href: "/profile",
    icon: UserRound,
    tone: "bg-zinc-100 text-zinc-800",
  },
  {
    title: "Achievements",
    description: "Koleksi pencapaian pribadi akan hadir untuk merayakan progres belajar.",
    href: "/achievements",
    icon: Medal,
    status: "Segera hadir",
    tone: "bg-violet-50 text-violet-700",
  },
  {
    title: "Daily Missions",
    description: "Tantangan harian akan membantu menjaga ritme baca dan diskusi.",
    href: "/missions",
    icon: CheckCircle2,
    status: "Segera hadir",
    tone: "bg-emerald-50 text-emerald-700",
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
    return <main className="p-6">Memuat dashboard...</main>;
  }

  if (error) {
    return <main className="p-6 text-red-600">{error}</main>;
  }

  if (!user) {
    return null;
  }

  return (
    <YomuShell mode="learner">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 md:px-8 lg:px-10">
        <section className="overflow-hidden rounded-[2rem] border border-black/5 bg-white/88 shadow-[0_28px_70px_-42px_rgba(30,64,175,0.28)]">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5 border-b border-zinc-200/70 bg-[linear-gradient(135deg,_rgba(224,231,255,0.92),_rgba(255,247,237,0.84))] px-6 py-7 lg:border-r lg:border-b-0 lg:px-8 lg:py-8">
              <Badge className="w-fit bg-indigo-700 px-3 py-1 text-white">Dashboard Pelajar</Badge>
              <div className="space-y-3">
                <h1 className="max-w-3xl text-4xl leading-tight font-semibold text-zinc-950">
                  Halo, {user.display_name}
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-zinc-600 md:text-base">
                  Dari sini alur belajar dibuat berurutan: baca artikel, kerjakan kuis, diskusi, lalu bawa skor ke perjalanan clan.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="rounded-full bg-zinc-950 text-white hover:bg-zinc-800">
                  <Link href="/bacaankuis">Mulai baca</Link>
                </Button>
                <Button type="button" variant="outline" className="rounded-full" onClick={onLogout} disabled={loggingOut}>
                  <LogOut className="size-4" />
                  {loggingOut ? "Logout..." : "Logout"}
                </Button>
              </div>
            </div>

            <div className="grid gap-4 px-6 py-7 lg:px-8 lg:py-8">
              {quickStats.map((item) => {
                const Icon = item.icon;

                return (
                  <Card key={item.title} className="border-black/5 bg-white shadow-none">
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

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <ModuleCard key={module.href} {...module} />
          ))}
        </section>

        <DashboardReadingPreview />
        <DashboardForumPreview />
      </div>
    </YomuShell>
  );
}
