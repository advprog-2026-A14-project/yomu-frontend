import Link from "next/link";
import { ArrowRight, BookOpenText, ChartNoAxesColumn, Sparkles } from "lucide-react";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import type { ReadingArticle } from "@/src/lib/api/reading";

type Props = {
  articles: ReadingArticle[];
  notice?: string;
};

const stats = [
  { label: "Bacaan aktif", value: "12", detail: "Fokus pada artikel yang terhubung ke kuis" },
  { label: "Rata-rata akurasi", value: "78%", detail: "Mock insight untuk landing katalog" },
  { label: "Mode belajar", value: "One take", detail: "Menyesuaikan aturan backend Java" },
];

export function ReadingCatalog({ articles, notice }: Props) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_rgba(244,240,227,0.85)_28%,_rgba(216,232,224,0.8)_62%,_rgba(255,255,255,1)_100%)] text-zinc-900">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-5 md:px-8 lg:px-10">
        <div className="overflow-hidden rounded-2xl border border-black/5 bg-white/75 shadow-[0_30px_80px_-45px_rgba(58,94,71,0.45)] backdrop-blur">
          <div className="grid min-w-0 gap-7 px-5 py-7 md:px-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.9fr)] lg:px-10 lg:py-10">
            <div className="min-w-0 space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="max-w-full whitespace-normal bg-emerald-700/90 px-3 py-1 text-[11px] tracking-wide text-white uppercase">
                  Yomu Reading Lab
                </Badge>
                <span className="min-w-0 text-sm leading-6 text-zinc-500">{notice ?? "Modul bacaan + kuis"}</span>
              </div>

              <div className="space-y-4">
                <h1 className="max-w-3xl text-3xl leading-tight font-semibold text-pretty sm:text-4xl md:text-[2.75rem]">
                  Belajar membaca dengan ritme yang tenang, lalu uji pemahamanmu dalam satu alur.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-zinc-600 md:text-lg">
                  Katalog ini dirancang mengikuti kontrak backend `articles` dan `quizzes`: pilih satu
                  bacaan, kerjakan kuis terkait, lalu submit sekali sebagai hasil akhir.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button asChild className="h-auto min-h-9 whitespace-normal rounded-full bg-zinc-950 px-5 py-2 text-center text-white hover:bg-zinc-800">
                  <Link href={`/bacaankuis/${articles[0]?.id ?? ""}`}>
                    Coba Artikel Pertama
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-auto min-h-9 whitespace-normal rounded-full border-emerald-900/15 bg-white/70 px-5 py-2 text-center"
                >
                  <Link href="/app">Kembali ke Hub</Link>
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
                      Lebih editorial daripada dashboard biasa, supaya sisi “membaca” tetap terasa kuat.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <p className="text-xs tracking-wide text-zinc-400 uppercase">{stat.label}</p>
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
                <p className="font-medium">Bacaan sebagai pusat pengalaman</p>
                <p className="text-sm leading-6 text-zinc-600">
                  Isi artikel diberi ruang visual luas agar user tidak merasa sedang mengerjakan form.
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
                <p className="font-medium">Progress terasa jelas</p>
                <p className="text-sm leading-6 text-zinc-600">
                  Progress bar, nomor soal, dan sticky action membantu user tahu posisi mereka.
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
                <p className="font-medium">Sesuai backend saat ini</p>
                <p className="text-sm leading-6 text-zinc-600">
                  Mockup ini belum mengandalkan timer, attempt history, atau review multi-submit.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="grid gap-5 lg:grid-cols-3">
          {articles.map((article) => (
            <Link key={article.id} href={`/bacaankuis/${article.id}`} className="group block">
              <Card className="h-full overflow-hidden border-black/6 bg-white/82 transition-transform duration-300 hover:-translate-y-1">
                <div className={`min-h-48 bg-gradient-to-br ${article.accent} p-5 sm:p-6`}>
                  <div className="flex min-h-40 flex-col justify-between gap-5">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="max-w-full whitespace-normal border-zinc-900/10 bg-white/55 text-zinc-800">
                        {article.category}
                      </Badge>
                      <Badge variant="outline" className="max-w-full whitespace-normal border-zinc-900/10 bg-white/55 text-zinc-800">
                        {article.source === "api" ? "Java Core" : "Mock"}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="w-fit rounded-full bg-white/55 px-3 py-1 text-xs text-zinc-700">
                        {article.readTime} • {article.difficulty}
                      </p>
                      <h2 className="max-w-full text-xl leading-tight font-semibold text-zinc-900 sm:text-2xl">
                        {article.title}
                      </h2>
                    </div>
                  </div>
                </div>

                <CardContent className="space-y-5 p-6">
                  <p className="text-sm leading-7 text-zinc-600">{article.summary}</p>

                  <div className="rounded-2xl bg-zinc-50 p-4">
                    <p className="text-xs tracking-wide text-zinc-500 uppercase">Insight</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">{article.insight}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-500">
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
          ))}
        </section>
      </section>
    </main>
  );
}
