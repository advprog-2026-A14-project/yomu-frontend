"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpenText, LogOut, MessageSquareText, Trophy } from "lucide-react";

import { DashboardReadingPreview } from "@/src/components/bacaankuis/DashboardReadingPreview";
import { DashboardForumPreview } from "@/src/components/forum/DashboardForumPreview";
import { DashboardClanPreview } from "@/src/components/clan/DashboardClanPreview";
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

        <DashboardReadingPreview />
        <DashboardClanPreview />
        <DashboardForumPreview />
      </div>
    </main>
  );
}
