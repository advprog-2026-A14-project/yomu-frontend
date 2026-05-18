"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, RotateCcw, ShieldCheck } from "lucide-react";

import { logout, me, type User } from "@/src/lib/api/auth";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";

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
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex min-w-0 flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 md:flex-row md:items-center md:justify-between md:p-6">
          <div className="min-w-0">
            <p className="text-sm text-zinc-500">Masuk sebagai Admin</p>
            <h1 className="mt-1 text-2xl font-semibold leading-tight">Halo, {user.display_name}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
              Halaman admin sekarang menjadi pintu masuk fitur operasional, bukan hanya greeting.
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
          <Card className="min-w-0 border-zinc-200 bg-white">
            <CardContent className="space-y-3 p-5">
              <ShieldCheck className="size-5 text-zinc-700" />
              <h2 className="font-semibold">Session Admin</h2>
              <p className="text-sm leading-6 text-zinc-600">
                Role divalidasi dari `GET /api/v1/users/me`; user non-admin akan diarahkan ke `/app`.
              </p>
            </CardContent>
          </Card>

          <Card className="min-w-0 border-zinc-200 bg-white">
            <CardContent className="space-y-3 p-5">
              <RotateCcw className="size-5 text-zinc-700" />
              <h2 className="font-semibold">Outbox Sync</h2>
              <p className="text-sm leading-6 text-zinc-600">
                Backend Java sudah punya endpoint retry failed sync. Frontend BFF/admin UI detail bisa
                ditambahkan di atas pola auth yang sama.
              </p>
            </CardContent>
          </Card>
        </div>

        <Button asChild className="w-fit">
          <Link href="/app">Lihat Hub Pelajar</Link>
        </Button>
      </section>
    </main>
  );
}
