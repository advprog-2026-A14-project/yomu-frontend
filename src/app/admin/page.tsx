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
  RotateCcw,
  Shield,
} from "lucide-react";

import { AdminBacaanKuisManager } from "@/src/components/bacaankuis/AdminBacaanKuisManager";
import { FailedSyncEventsPanel } from "@/src/components/admin/FailedSyncEventsPanel";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { logout, me, type User } from "@/src/lib/api/auth";

const adminModules = [
  {
    title: "Konten Bacaan & Kuis",
    description: "Endpoint admin Java tersedia untuk create/delete artikel dan create/edit/delete kuis.",
    status: "Aktif",
    icon: BookOpenText,
  },
  {
    title: "Moderasi Forum",
    description: "Admin dapat menghapus komentar melalui halaman forum artikel.",
    status: "Aktif via forum",
    icon: MessageSquareText,
  },
  {
    title: "Outbox Sync",
    description: "Pantau dan retry event Java ke Rust yang gagal.",
    status: "Aktif",
    icon: RotateCcw,
  },
  {
    title: "Achievement Admin",
    description: "Create/edit/delete achievement belum punya endpoint siap konsumsi.",
    status: "Menunggu backend",
    icon: Medal,
  },
  {
    title: "Daily Mission Admin",
    description: "Create/edit/delete mission dan claim reward belum terpasang di router utama.",
    status: "Menunggu backend",
    icon: CalendarCheck2,
  },
  {
    title: "End Season Liga",
    description: "Trigger pergantian musim liga belum tersedia untuk frontend.",
    status: "Menunggu backend",
    icon: Shield,
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
    return <main className="p-6">Memuat data admin...</main>;
  }

  if (error) {
    return <main className="p-6 text-red-600">{error}</main>;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f4efe3_0%,_#f7f7f4_38%,_#eef4ef_100%)] px-5 py-8 text-zinc-950 md:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="overflow-hidden rounded-[2rem] border border-black/5 bg-white/82 shadow-[0_28px_70px_-42px_rgba(59,86,64,0.42)]">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5 border-b border-zinc-200/70 bg-[linear-gradient(135deg,_rgba(215,248,238,0.9),_rgba(250,246,231,0.82))] px-6 py-7 lg:border-r lg:border-b-0 lg:px-8 lg:py-8">
              <Badge className="w-fit bg-emerald-700 px-3 py-1 text-white">Dashboard Admin</Badge>
              <div>
                <h1 className="text-4xl font-semibold leading-tight">Halo, {user.display_name}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600">
                  Dashboard ini memusatkan fitur admin yang sudah punya endpoint aktif dan memberi status jelas
                  untuk modul yang masih menunggu kontrak backend.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="rounded-full bg-zinc-950 text-white hover:bg-zinc-800">
                  <Link href="/bacaankuis">
                    Buka katalog konten
                    <ArrowRight className="size-4" />
                  </Link>
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
              {adminModules.slice(0, 3).map((item) => {
                const Icon = item.icon;

                return (
                  <Card key={item.title} className="border-black/5 bg-white/86 shadow-none">
                    <CardContent className="flex items-start gap-4 p-5">
                      <div className="rounded-2xl bg-zinc-950 p-3 text-white">
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="mt-1 text-sm leading-6 text-zinc-600">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {adminModules.map((item) => {
            const Icon = item.icon;
            const waiting = item.status.includes("Menunggu");

            return (
              <Card key={item.title} className="border-black/5 bg-white/86">
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className={`rounded-2xl p-3 ${waiting ? "bg-zinc-100 text-zinc-700" : "bg-emerald-100 text-emerald-700"}`}>
                      <Icon className="size-5" />
                    </div>
                    <Badge variant={waiting ? "outline" : "default"} className={waiting ? "" : "bg-emerald-700 text-white"}>
                      {item.status}
                    </Badge>
                  </div>
                  <div>
                    <h2 className="font-semibold">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <AdminBacaanKuisManager adminName={user.display_name} />
        <FailedSyncEventsPanel />
      </div>
    </main>
  );
}
