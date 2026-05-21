"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Shield } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { logout, me, type User } from "@/src/lib/api/auth";

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
    return <main className="p-6">Memuat data...</main>;
  }

  if (error) {
    return <main className="p-6 text-red-600">{error}</main>;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f4efe3_0%,_#f7f7f4_38%,_#eef4ef_100%)] px-6 py-10">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <Card className="overflow-hidden border-black/5 bg-white/88 shadow-[0_28px_70px_-42px_rgba(59,86,64,0.42)]">
          <CardContent className="grid gap-6 px-6 py-8 md:grid-cols-[1.1fr_0.9fr] md:px-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-emerald-800">
                <div className="rounded-2xl bg-emerald-100 p-3">
                  <Shield className="size-5" />
                </div>
                <p className="text-sm font-medium">Mode admin aktif</p>
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold text-zinc-950">Halo, {user.display_name}</h1>
                <p className="max-w-2xl text-sm leading-7 text-zinc-600">
                  Pengelolaan bacaan dan kuis sekarang terintegrasi langsung di flow `bacaankuis`. Jadi kamu tidak perlu lagi memakai form admin terpisah untuk menambah artikel atau menyunting soal.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="rounded-full bg-zinc-950 text-white hover:bg-zinc-800">
                  <Link href="/bacaankuis">
                    Buka ruang kelola bacaankuis
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
                  {loggingOut ? "Logout..." : "Logout"}
                </Button>
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-zinc-950 p-6 text-white">
              <p className="text-xs tracking-[0.18em] text-zinc-400 uppercase">Di mana mengelola konten?</p>
              <div className="mt-4 space-y-4 text-sm leading-6 text-zinc-300">
                <p>Tambah bacaan baru langsung dari halaman katalog `/bacaankuis`.</p>
                <p>Tambah banyak soal, edit, dan hapus soal langsung dari halaman detail artikel.</p>
                <p>Tombol-tombol itu hanya tampil kalau session kamu memang ber-role `ADMIN`.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
