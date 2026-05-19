import Link from "next/link";
import { ArrowRight, BookOpenText, ChartNoAxesColumn, Sparkles } from "lucide-react";

import { CatalogAdminActions } from "@/src/components/bacaankuis/CatalogAdminActions";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import type { Article } from "@/src/lib/bacaankuis";
import { categoryAccent, estimateReadTime, summarizeContent } from "@/src/lib/bacaankuis";

type Props = {
  articles: Article[];
  categories: string[];
  activeCategory?: string;
  error?: string | null;
  isAdmin?: boolean;
  adminName?: string | null;
};

function buildStats(articles: Article[], categories: string[]) {
  return [
    {
      label: "Bacaan aktif",
      value: String(articles.length),
      detail: "Daftar ini langsung memakai endpoint artikel dari backend Java.",
    },
    {
      label: "Kategori",
      value: String(categories.length),
      detail: "Filter kategori mengikuti query `?category=` dari API publik.",
    },
    {
      label: "Mode kuis",
      value: "Login required",
      detail: "Soal dan submit kuis hanya bisa diakses saat user sudah login.",
    },
  ];
}

export function ReadingCatalog({
  articles,
  categories,
  activeCategory,
  error,
  isAdmin,
  adminName,
}: Props) {
  const stats = buildStats(articles, categories);

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
                <span className="text-sm text-zinc-500">Bacaan, kuis, dan pengelolaan konten dalam satu alur</span>
              </div>

              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl leading-tight font-semibold text-balance md:text-5xl">
                  Belajar membaca dengan ritme yang tenang, lalu uji pemahamanmu dalam satu ruang.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-zinc-600 md:text-lg">
                  Katalog ini mengikuti kontrak backend `articles` dan `quizzes`: pilih satu bacaan, buka kuis
                  terkait, lalu submit sekali sebagai hasil akhir. Admin juga bisa menambah bacaan langsung dari sini.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  className="rounded-full bg-zinc-950 px-6 text-white hover:bg-zinc-800"
                  disabled={articles.length === 0}
                >
                  <Link href={articles[0] ? `/bacaankuis/${articles[0].id}` : "/bacaankuis"}>
                    Coba artikel pertama
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-emerald-900/15 bg-white/70 px-6">
                  <Link href="/">Kembali ke home</Link>
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
                      Lebih editorial daripada dashboard biasa, supaya pengalaman membaca tetap dominan.
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

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/bacaankuis"
            className={`rounded-full px-4 py-2 text-sm transition ${
              !activeCategory
                ? "bg-zinc-950 text-white"
                : "border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
            }`}
          >
            Semua
          </Link>
          {categories.map((category) => (
            <Link
              key={category}
              href={`/bacaankuis?category=${encodeURIComponent(category)}`}
              className={`rounded-full px-4 py-2 text-sm transition ${
                activeCategory === category
                  ? "bg-emerald-700 text-white"
                  : "border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
              }`}
            >
              {category}
            </Link>
          ))}
        </div>

        {isAdmin && adminName ? <CatalogAdminActions adminName={adminName} /> : null}

        {error ? (
          <Card className="border-red-200 bg-red-50/80">
            <CardContent className="p-6 text-sm leading-6 text-red-700">{error}</CardContent>
          </Card>
        ) : null}

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
                <p className="font-medium">Admin tidak perlu keluar konteks</p>
                <p className="text-sm leading-6 text-zinc-600">
                  Tombol tambah bacaan hanya muncul untuk admin dan langsung menempel di katalog ini.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="grid gap-5 lg:grid-cols-3">
          {articles.length === 0 ? (
            <Card className="border-black/6 bg-white/82 lg:col-span-3">
              <CardContent className="p-10 text-center">
                <p className="text-lg font-medium text-zinc-900">Belum ada bacaan pada filter ini.</p>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Coba ganti kategori atau periksa apakah backend Java sudah memiliki data artikel.
                </p>
              </CardContent>
            </Card>
          ) : null}

          {articles.map((article) => (
            <Link key={article.id} href={`/bacaankuis/${article.id}`} className="group block">
              <Card className="h-full overflow-hidden border-black/6 bg-white/82 transition-transform duration-300 hover:-translate-y-1">
                <div className={`h-40 bg-gradient-to-br ${categoryAccent(article.category)} p-6`}>
                  <div className="flex h-full flex-col justify-between">
                    <Badge variant="outline" className="w-fit border-zinc-900/10 bg-white/55 text-zinc-800">
                      {article.category}
                    </Badge>
                    <div className="space-y-2">
                      <p className="w-fit rounded-full bg-white/55 px-3 py-1 text-xs text-zinc-700">
                        {estimateReadTime(article.content)} - Artikel publik
                      </p>
                      <h2 className="max-w-xs text-2xl leading-tight font-semibold text-zinc-900">
                        {article.title}
                      </h2>
                    </div>
                  </div>
                </div>

                <CardContent className="space-y-5 p-6">
                  <p className="text-sm leading-7 text-zinc-600">{summarizeContent(article.content)}</p>

                  <div className="rounded-2xl bg-zinc-50 p-4">
                    <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">Insight</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Halaman detail akan menampilkan bacaan utuh, panel kuis, dan kontrol admin langsung pada artikel bila kamu punya role ADMIN.
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-zinc-500">
                    <span>ID: {article.id}</span>
                    <span>{estimateReadTime(article.content)}</span>
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
