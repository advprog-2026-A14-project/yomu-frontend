import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  MessageSquareText,
  Shield,
  Sparkles,
  Trophy,
} from "lucide-react";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { YomuShell } from "@/src/components/yomu/YomuShell";

const flow = [
  {
    title: "Baca",
    description: "Pilih artikel, baca dengan layout nyaman, lalu lanjut ke kuis artikel yang sama.",
    icon: BookOpenText,
  },
  {
    title: "Uji",
    description: "Jawab soal sekali submit. Nilai akhir langsung tercatat ke progres belajarmu.",
    icon: Sparkles,
  },
  {
    title: "Diskusi",
    description: "Masuk forum artikel, beri reaksi, dan lihat konteks clan atau tier jika tersedia.",
    icon: MessageSquareText,
  },
  {
    title: "Bersaing",
    description: "Buat clan, kumpulkan skor, dan pantau ranking tier Bronze sampai Diamond.",
    icon: Trophy,
  },
];

const systemCards = [
  ["Belajar Terarah", "Artikel, kuis, dan hasil belajar tersusun dalam satu alur yang mudah diikuti."],
  ["Komunitas Clan", "Bergabung dengan teman, kumpulkan skor, dan naik tier bersama."],
  ["Ruang Admin", "Konten, soal, diskusi, dan pemulihan data dikelola dari satu tempat."],
];

export default function HomePage() {
  return (
    <YomuShell mode="public">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-8 px-5 py-10 md:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:px-10">
        <div className="space-y-7">
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-indigo-700 px-3 py-1 text-white">Yomu</Badge>
            <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-800">
              Literasi + gamifikasi
            </Badge>
          </div>

          <div className="space-y-5">
            <h1 className="max-w-4xl text-5xl leading-[1.02] font-semibold text-zinc-950 md:text-6xl">
              Belajar membaca, berdiskusi, lalu naik liga bersama clan.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-zinc-600 md:text-lg">
              Yomu mengubah alur membaca menjadi perjalanan yang utuh: artikel, kuis, forum, clan, dan leaderboard dalam satu pengalaman yang hangat dan mudah dipahami.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="rounded-full bg-zinc-950 px-6 text-white hover:bg-zinc-800">
              <Link href="/auth/register">
                Mulai sebagai pelajar
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-indigo-200 bg-white px-6">
              <Link href="/bacaankuis">Lihat katalog bacaan</Link>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-[0_35px_90px_-50px_rgba(30,64,175,0.55)]">
            <div className="bg-[linear-gradient(135deg,_#e0e7ff_0%,_#fef3c7_52%,_#dcfce7_100%)] p-5 md:p-6">
              <div className="grid gap-4">
                <Card className="border-white/70 bg-white/82">
                  <CardContent className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                      <p className="text-xs font-medium tracking-[0.18em] text-indigo-700 uppercase">Sesi hari ini</p>
                      <h2 className="mt-2 text-2xl font-semibold">Memahami informasi digital</h2>
                      <p className="mt-2 text-sm leading-6 text-zinc-600">Artikel aktif, 4 soal, forum siap setelah kuis.</p>
                    </div>
                    <div className="grid size-24 place-items-center rounded-[1.5rem] bg-zinc-950 text-white">
                      <BookOpenText className="size-9" />
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="border-white/70 bg-white/86">
                    <CardContent className="p-5">
                      <Shield className="size-6 text-indigo-700" />
                      <p className="mt-4 text-sm font-medium text-zinc-950">Clan aktif</p>
                      <p className="mt-1 text-3xl font-semibold">Gold</p>
                      <p className="mt-2 text-sm text-zinc-500">Tier aktif dari perjalanan clan.</p>
                    </CardContent>
                  </Card>

                  <Card className="border-white/70 bg-zinc-950 text-white">
                    <CardContent className="p-5">
                      <Trophy className="size-6 text-amber-300" />
                      <p className="mt-4 text-sm font-medium text-zinc-300">Skor clan</p>
                      <p className="mt-1 text-3xl font-semibold">12.480</p>
                      <p className="mt-2 text-sm text-zinc-400">Masuk leaderboard per tier.</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-3 rounded-[1.5rem] bg-white/72 p-4">
                  {flow.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <div key={item.title} className="flex items-start gap-3 rounded-[1.25rem] bg-white px-4 py-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-700">
                          <Icon className="size-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-950">
                            {index + 1}. {item.title}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-zinc-500">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-4 px-5 pb-12 md:grid-cols-3 md:px-8 lg:px-10">
        {systemCards.map(([title, description]) => (
          <Card key={title} className="border-black/5 bg-white/88">
            <CardContent className="p-5">
              <p className="text-lg font-semibold text-zinc-950">{title}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </YomuShell>
  );
}
