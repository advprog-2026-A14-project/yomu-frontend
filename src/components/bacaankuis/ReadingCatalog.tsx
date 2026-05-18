import Link from "next/link";
import { ArrowRight, BookOpenText, ChartNoAxesColumn, Sparkles } from "lucide-react";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";

export type ReadingCatalogArticle = {
  id: string;
  title: string;
  category: string;
  summary: string;
  readTime: string;
  difficulty: "Pemanasan" | "Menengah" | "Tantangan";
  completionRate: number;
  accent: string;
  insight: string;
  questions: unknown[];
};

type Props = {
  articles: ReadingCatalogArticle[];
  error?: string | null;
};

export function ReadingCatalog({ articles, error }: Props) {
  const stats = [
    { label: "Bacaan aktif", value: String(articles.length), detail: "Artikel dari Java Core melalui BFF" },
    { label: "Submit", value: "One take", detail: "Attempt kuis mengikuti kontrak backend" },
    { label: "Auth", value: "Cookie JWT", detail: "BFF meneruskan token ke service tujuan" },
  ];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_rgba(244,240,227,0.85)_28%,_rgba(216,232,224,0.8)_62%,_rgba(255,255,255,1)_100%)] text-zinc-900">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-8 md:px-8 lg:px-10">
        <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white/75 shadow-[0_30px_80px_-45px_rgba(58,94,71,0.45)] backdrop-blur">
          <div className="grid gap-8 px-6 py-8 md:px-10 lg:grid-cols-[1.35fr_0.9fr] lg:px-12 lg:py-12">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="bg-emerald-700/90 px-3 py-1 text-[11px] tracking-[0.18em] text-white uppercase">
                  Yomu Reading Lab
                </Badge>
                <span className="text-sm text-zinc-500">Artikel, kuis, forum, dan score dalam satu alur</span>
              </div>

              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl leading-tight font-semibold text-balance md:text-5xl">
                  Pilih bacaan, kerjakan kuis, lalu lanjutkan diskusi tanpa keluar dari sesi Yomu.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-zinc-600 md:text-lg">
                  Halaman ini membaca `/api/v1/articles`, membuka kuis terkait, dan submit hasil melalui
                  BFF agar Java Core dan Rust Engine tetap tersinkron lewat cookie auth.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button asChild className="rounded-full bg-zinc-950 px-6 text-white hover:bg-zinc-800">
                  <Link href={articles[0] ? `/bacaankuis/${articles[0].id}` : "/bacaankuis"}>
                    Coba Artikel Pertama
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-emerald-900/15 bg-white/70 px-6">
                  <Link href="/app">Ke Dashboard</Link>
                </Button>
              </div>
            </div>

            <Card className="border-0 bg-zinc-950 text-white shadow-none">
              <CardContent className="space-y-6 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-400/15 p-3 text-emerald-300">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Arah visual</p>
                    <p className="text-sm text-zinc-400">
                      Editorial untuk membaca, tetapi tetap ringkas seperti fitur dashboard lain.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3">
                  {stats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs tracking-[0.18em] text-zinc-400 uppercase">{stat.label}</p>
                      <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                      <p className="mt-1 text-sm leading-6 text-zinc-400">{stat.detail}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-emerald-900/10 bg-white/80">
            <CardContent className="flex items-start gap-4 p-6">
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                <BookOpenText className="size-5" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">Artikel dari Core</p>
                <p className="text-sm leading-6 text-zinc-600">
                  Katalog memakai Java Core sebagai sumber artikel utama, bukan fetch langsung ke backend.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-sky-900/10 bg-white/80">
            <CardContent className="flex items-start gap-4 p-6">
              <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                <ChartNoAxesColumn className="size-5" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">Score tersinkron</p>
                <p className="text-sm leading-6 text-zinc-600">
                  Submit kuis masuk ke Java, lalu Java meneruskan riwayat score ke Rust Engine.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-900/10 bg-white/80">
            <CardContent className="flex items-start gap-4 p-6">
              <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                <Sparkles className="size-5" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">Forum tetap dekat</p>
                <p className="text-sm leading-6 text-zinc-600">
                  Setiap artikel bisa dibuka ke diskusi yang memakai token user aktif.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {error ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
            {error}
          </div>
        ) : null}

        <section className="grid gap-5 lg:grid-cols-3">
          {articles.length === 0 ? (
            <Card className="border-black/6 bg-white/82 lg:col-span-3">
              <CardContent className="p-8 text-center text-sm text-zinc-500">
                Belum ada artikel yang tersedia dari Core API.
              </CardContent>
            </Card>
          ) : (
            articles.map((article) => (
              <Link key={article.id} href={`/bacaankuis/${article.id}`} className="group block">
                <Card className="h-full overflow-hidden border-black/6 bg-white/82 transition-transform duration-300 hover:-translate-y-1">
                  <div className={`h-40 bg-gradient-to-br ${article.accent} p-6`}>
                    <div className="flex h-full flex-col justify-between">
                      <Badge variant="outline" className="w-fit border-zinc-900/10 bg-white/55 text-zinc-800">
                        {article.category}
                      </Badge>
                      <div className="space-y-2">
                        <p className="w-fit rounded-full bg-white/55 px-3 py-1 text-xs text-zinc-700">
                          {article.readTime} - {article.difficulty}
                        </p>
                        <h2 className="max-w-xs text-2xl leading-tight font-semibold text-zinc-900">
                          {article.title}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <CardContent className="space-y-5 p-6">
                    <p className="text-sm leading-7 text-zinc-600">{article.summary}</p>

                    <div className="rounded-2xl bg-zinc-50 p-4">
                      <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">Insight</p>
                      <p className="mt-2 text-sm leading-6 text-zinc-700">{article.insight}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-zinc-500">
                      <span>{article.questions.length} soal</span>
                      <span>{article.completionRate}% completion</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
                      <span className="text-sm font-medium text-zinc-900">Buka ruang baca</span>
                      <ArrowRight className="size-4 text-zinc-500 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </section>
      </section>
    </main>
  );
}
