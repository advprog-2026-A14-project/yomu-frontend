import Link from "next/link";
import { ArrowLeft, CheckCircle2, Medal, Star, Trophy } from "lucide-react";

import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";

const plannedAchievements = [
  {
    title: "Pembaca Awal",
    milestone: "Selesaikan 1 bacaan",
    state: "Menunggu endpoint progres",
    icon: CheckCircle2,
  },
  {
    title: "Konsisten Membaca",
    milestone: "Selesaikan 10 bacaan",
    state: "Menunggu event quiz-history",
    icon: Star,
  },
  {
    title: "Kontributor Clan",
    milestone: "Bantu clan naik tier",
    state: "Menunggu sinyal liga",
    icon: Trophy,
  },
];

const integrationGaps = [
  "List achievement pelajar belum punya endpoint FE siap konsumsi.",
  "Profil publik achievement pelajar belum tersedia.",
  "Pemilihan achievement untuk ditampilkan di profil belum tersedia.",
  "Admin create, edit, dan delete achievement belum tersedia.",
];

export default function AchievementsPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f4efe3_0%,_#f7f7f4_38%,_#eef4ef_100%)] px-5 py-8 text-zinc-950 md:px-8 lg:px-10">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white/82 shadow-[0_28px_70px_-42px_rgba(59,86,64,0.35)]">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5 border-b border-zinc-200/70 bg-[linear-gradient(135deg,_rgba(237,231,255,0.92),_rgba(248,243,228,0.84))] px-6 py-7 lg:border-r lg:border-b-0 lg:px-8 lg:py-8">
              <Link href="/app" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900">
                <ArrowLeft className="size-4" />
                Kembali ke dashboard
              </Link>
              <Badge className="w-fit bg-violet-700 px-3 py-1 text-white">Gamifikasi</Badge>
              <div>
                <h1 className="text-4xl font-semibold leading-tight">Achievements</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600">
                  Halaman ini sudah menyiapkan struktur pengalaman achievement untuk pelajar, tetapi tidak
                  memanggil data palsu karena endpoint achievement belum tersedia pada kontrak backend saat ini.
                </p>
              </div>
            </div>

            <div className="bg-zinc-950 px-6 py-7 text-white lg:px-8 lg:py-8">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-violet-400/15 p-3 text-violet-200">
                  <Medal className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Status integrasi</p>
                  <p className="text-sm text-zinc-400">Belum ada API production untuk data aktif.</p>
                </div>
              </div>
              <div className="mt-6 grid gap-3">
                {integrationGaps.map((item) => (
                  <div key={item} className="rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-zinc-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {plannedAchievements.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title} className="border-black/5 bg-white/86">
                <CardContent className="space-y-4 p-6">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">{item.milestone}</p>
                  </div>
                  <div className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-600">{item.state}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}
