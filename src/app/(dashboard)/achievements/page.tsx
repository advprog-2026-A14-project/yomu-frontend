import Link from "next/link";

import { Card, CardContent } from "@/src/components/ui/card";

export default function AchievementsPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-6 text-zinc-950 sm:px-5 md:px-8">
      <section className="mx-auto max-w-3xl">
        <Link href="/app" className="text-sm text-zinc-500 hover:text-zinc-900">
          Kembali ke hub
        </Link>
        <h1 className="mt-3 text-3xl font-semibold leading-tight">Achievements</h1>
        <Card className="mt-6 border-zinc-200 bg-white">
          <CardContent className="space-y-3 p-5 text-sm leading-6 text-zinc-600">
            <p>
              Achievement belum punya endpoint aktif yang terdokumentasi di frontend. Halaman ini dipertahankan
              sebagai status integrasi agar user tidak melihat placeholder `page`.
            </p>
            <p>Setelah kontrak backend tersedia, halaman ini bisa memakai pola BFF yang sama dengan leaderboard.</p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
