import Link from "next/link";
import { ArrowLeft, CalendarCheck2, CheckCircle2, Gift, RefreshCw } from "lucide-react";

import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";

const plannedMissions = [
  {
    title: "Baca artikel kategori News",
    progress: 33,
    note: "Contoh tampilan progress 1/3 setelah endpoint aktif.",
  },
  {
    title: "Berikan komentar berbobot",
    progress: 0,
    note: "Menunggu event forum dan kontrak daily mission.",
  },
  {
    title: "Selesaikan kuis dengan akurasi tinggi",
    progress: 75,
    note: "Menunggu integrasi quiz-history ke mission router.",
  },
];

export default function MissionsPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f4efe3_0%,_#f7f7f4_38%,_#eef4ef_100%)] px-5 py-8 text-zinc-950 md:px-8 lg:px-10">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white/82 shadow-[0_28px_70px_-42px_rgba(59,86,64,0.35)]">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-5 border-b border-zinc-200/70 bg-[linear-gradient(135deg,_rgba(214,249,238,0.92),_rgba(248,243,228,0.84))] px-6 py-7 lg:border-r lg:border-b-0 lg:px-8 lg:py-8">
              <Link href="/app" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900">
                <ArrowLeft className="size-4" />
                Kembali ke dashboard
              </Link>
              <Badge className="w-fit bg-teal-700 px-3 py-1 text-white">Daily Missions</Badge>
              <div>
                <h1 className="text-4xl font-semibold leading-tight">Misi Harian</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600">
                  UI ini menyiapkan pola list, progress, dan reward harian. Router mission Rust belum aktif pada
                  implementasi saat ini, jadi halaman tidak mengirim request ke endpoint yang belum siap.
                </p>
              </div>
            </div>

            <div className="bg-zinc-950 px-6 py-7 text-white lg:px-8 lg:py-8">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-teal-400/15 p-3 text-teal-200">
                  <CalendarCheck2 className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Status backend</p>
                  <p className="text-sm text-zinc-400">Daily mission dan claim reward belum siap konsumsi FE.</p>
                </div>
              </div>
              <div className="mt-6 space-y-3 text-sm leading-6 text-zinc-300">
                <div className="rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3">
                  Admin create, edit, dan delete daily mission belum ada endpoint aktif.
                </div>
                <div className="rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3">
                  Claim reward disebut belum terpasang di router utama Rust.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
          <Card className="border-black/5 bg-white/86">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-teal-100 p-3 text-teal-700">
                  <RefreshCw className="size-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Preview layout misi</h2>
                  <p className="text-sm text-zinc-500">Data di bawah adalah kerangka UI, bukan response backend.</p>
                </div>
              </div>
              <div className="grid gap-4">
                {plannedMissions.map((mission) => (
                  <div key={mission.title} className="rounded-[1.5rem] border border-zinc-200 bg-white p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-medium text-zinc-950">{mission.title}</p>
                      <span className="text-sm text-zinc-500">{mission.progress}%</span>
                    </div>
                    <Progress value={mission.progress} className="mt-4" />
                    <p className="mt-3 text-sm leading-6 text-zinc-600">{mission.note}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-black/5 bg-white/86">
            <CardContent className="space-y-5 p-6">
              <div className="rounded-[1.5rem] bg-amber-50 p-5">
                <Gift className="size-6 text-amber-700" />
                <h2 className="mt-4 text-lg font-semibold">Reward dan buff clan</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Saat endpoint aktif, completion mission bisa menjadi sumber buff clan seperti Productivity Buff
                  yang memengaruhi skor liga.
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-emerald-50 p-5">
                <CheckCircle2 className="size-6 text-emerald-700" />
                <h2 className="mt-4 text-lg font-semibold">Yang perlu backend sediakan</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  List mission aktif, progress per user, claim reward, dan endpoint admin untuk pengelolaan mission.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
