"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpenText,
  CalendarCheck2,
  LogOut,
  Medal,
  MessageSquareText,
  RefreshCw,
  Shield,
} from "lucide-react";

import { FailedSyncEventsPanel } from "@/src/components/admin/FailedSyncEventsPanel";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { ModuleCard } from "@/src/components/yomu/ModuleCard";
import { YomuShell } from "@/src/components/yomu/YomuShell";
import { logout, me, type User } from "@/src/lib/api/auth";

const adminModules = [
  {
    title: "Artikel & Kuis",
    description: "Create/delete artikel, tambah banyak soal, edit soal, dan hapus soal.",
    href: "/admin/articles",
    icon: BookOpenText,
    tone: "bg-indigo-50 text-indigo-700",
  },
  {
    title: "Kesehatan Sinkronisasi",
    description: "Pantau proses pengiriman data dan pulihkan item yang perlu diproses ulang.",
    href: "/admin/sync",
    icon: RefreshCw,
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Moderasi Forum",
    description: "Kelola percakapan artikel dan jaga ruang diskusi tetap sehat.",
    href: "/admin/forum",
    icon: MessageSquareText,
    status: "Parsial",
    tone: "bg-sky-50 text-sky-700",
  },
  {
    title: "Achievement Admin",
    description: "Pengelolaan pencapaian sedang disiapkan untuk rilis berikutnya.",
    href: "/admin/achievements",
    icon: Medal,
    status: "Segera hadir",
    tone: "bg-violet-50 text-violet-700",
  },
  {
    title: "Daily Mission Admin",
    description: "Pengelolaan misi harian sedang disiapkan untuk rilis berikutnya.",
    href: "/admin/missions",
    icon: CalendarCheck2,
    status: "Segera hadir",
    tone: "bg-amber-50 text-amber-700",
  },
  {
    title: "End Season Liga",
    description: "Penutupan musim liga akan dibuka saat aturan musim sudah siap.",
    href: "/admin/season",
    icon: Shield,
    status: "Segera hadir",
    tone: "bg-zinc-100 text-zinc-800",
  },
];

export default function AdminPage() {
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
        if (result.response.data.role !== "ADMIN") {
          router.replace("/app");
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
    return <main className="p-6">Memuat dashboard admin...</main>;
  }

  if (error) {
    return <main className="p-6 text-red-600">{error}</main>;
  }

  if (!user) {
    return null;
  }

  return (
    <YomuShell mode="admin">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-8 md:px-8 lg:px-10">
        <section className="overflow-hidden rounded-[2rem] border border-black/5 bg-white/88 shadow-[0_28px_70px_-42px_rgba(30,64,175,0.28)]">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5 border-b border-zinc-200/70 bg-[linear-gradient(135deg,_rgba(224,231,255,0.94),_rgba(255,247,237,0.86))] px-6 py-7 lg:border-r lg:border-b-0 lg:px-8 lg:py-8">
              <Badge className="w-fit bg-indigo-700 px-3 py-1 text-white">Dashboard Admin</Badge>
              <div className="space-y-3">
                <h1 className="text-4xl leading-tight font-semibold">Halo, {user.display_name}</h1>
                <p className="max-w-2xl text-sm leading-7 text-zinc-600 md:text-base">
                  Dashboard ini memusatkan tugas admin harian dan memberi penanda jelas untuk fitur yang belum dibuka.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="rounded-full bg-zinc-950 text-white hover:bg-zinc-800">
                  <Link href="/admin/articles">
                    Kelola artikel & kuis
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button type="button" variant="outline" className="rounded-full" onClick={onLogout} disabled={loggingOut}>
                  <LogOut className="size-4" />
                  {loggingOut ? "Logout..." : "Logout"}
                </Button>
              </div>
            </div>

            <div className="grid gap-4 px-6 py-7 lg:px-8 lg:py-8">
              {[
                ["Aktif", "Artikel, kuis, moderasi komentar, pemulihan sinkronisasi"],
                ["Segera hadir", "Achievement, daily mission, penutupan musim liga"],
                ["Fokus kerja", "Tombol hanya ditampilkan saat fitur sudah bisa dipakai"],
              ].map(([label, value]) => (
                <Card key={label} className="border-black/5 bg-white shadow-none">
                  <CardContent className="p-5">
                    <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">{label}</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">{value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {adminModules.map((module) => (
            <ModuleCard key={module.href} {...module} />
          ))}
        </section>

        <FailedSyncEventsPanel />
      </div>
    </YomuShell>
  );
}
