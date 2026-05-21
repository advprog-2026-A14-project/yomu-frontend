"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpenText, Sparkles } from "lucide-react";

import { getArticles } from "@/src/lib/api/bacaankuis";
import type { Article } from "@/src/lib/bacaankuis";
import { categoryAccent, estimateReadTime, summarizeContent } from "@/src/lib/bacaankuis";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";

export function DashboardReadingPreview() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadArticles = async () => {
      const response = await getArticles();

      if (!active) {
        return;
      }

      setLoading(false);

      if (!response.success || !("data" in response) || !response.data) {
        setError(response.message);
        return;
      }

      setArticles(response.data);
      setError(null);
    };

    void loadArticles();

    return () => {
      active = false;
    };
  }, []);

  const previewArticles = useMemo(() => articles.slice(0, 2), [articles]);
  const categories = useMemo(
    () => [...new Set(articles.map((article) => article.category).filter(Boolean))],
    [articles],
  );

  return (
    <section className="rounded-[2rem] border border-black/5 bg-white/82 shadow-[0_28px_70px_-42px_rgba(59,86,64,0.35)]">
      <div className="grid gap-0 lg:grid-cols-[1fr_1.05fr]">
        <div className="space-y-5 border-b border-zinc-200/70 bg-[linear-gradient(135deg,_rgba(215,248,238,0.9),_rgba(250,246,231,0.82))] px-6 py-7 lg:border-r lg:border-b-0 lg:px-8 lg:py-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/75 p-3 text-emerald-700">
              <BookOpenText className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900">Bacaan & Kuis</p>
              <p className="text-sm text-zinc-600">Preview modul bacaankuis dari backend Java</p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="max-w-xl text-3xl leading-tight font-semibold text-zinc-950">
              Lanjut baca artikel pilihan, lalu cek pemahamanmu lewat kuis yang terkait.
            </h2>
            <p className="max-w-xl text-sm leading-7 text-zinc-600">
              Dari dashboard ini kamu bisa mengintip artikel terbaru dulu, lalu pindah ke pengalaman penuh
              bacaankuis tanpa kehilangan konteks.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-full bg-zinc-950 text-white hover:bg-zinc-800">
              <Link href="/bacaankuis">
                Buka semua bacaan
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            {previewArticles[0] ? (
              <Button asChild variant="outline" className="rounded-full">
                <Link href={`/bacaankuis/${previewArticles[0].id}`}>Lanjut ke artikel pertama</Link>
              </Button>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 4).map((category) => (
              <Badge key={category} variant="outline" className="border-zinc-900/10 bg-white/65 text-zinc-700">
                {category}
              </Badge>
            ))}
            {categories.length > 4 ? (
              <Badge variant="outline" className="border-zinc-900/10 bg-white/65 text-zinc-700">
                +{categories.length - 4} kategori
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="space-y-4 px-6 py-7 lg:px-8 lg:py-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-900">Cuplikan artikel</p>
              <p className="text-sm text-zinc-500">Menampilkan isi katalog yang sekarang tersedia</p>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
              {articles.length} artikel
            </div>
          </div>

          {loading ? (
            <div className="rounded-[1.5rem] border border-dashed border-zinc-300 bg-zinc-50 px-5 py-8 text-sm text-zinc-500">
              Memuat preview bacaan...
            </div>
          ) : null}

          {error ? (
            <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-8 text-sm leading-6 text-red-700">
              {error}
            </div>
          ) : null}

          {!loading && !error && previewArticles.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-zinc-300 bg-zinc-50 px-5 py-8 text-sm text-zinc-500">
              Belum ada artikel untuk ditampilkan.
            </div>
          ) : null}

          {!loading && !error ? (
            <div className="grid gap-4">
              {previewArticles.map((article) => (
                <Link key={article.id} href={`/bacaankuis/${article.id}`} className="group block">
                  <Card className="overflow-hidden border-black/5 bg-white transition-transform duration-300 hover:-translate-y-1">
                    <div className={`h-24 bg-gradient-to-r ${categoryAccent(article.category)} px-5 py-4`}>
                      <div className="flex h-full items-end justify-between gap-3">
                        <Badge variant="outline" className="border-zinc-900/10 bg-white/70 text-zinc-800">
                          {article.category}
                        </Badge>
                        <span className="rounded-full bg-white/65 px-3 py-1 text-xs text-zinc-700">
                          {estimateReadTime(article.content)}
                        </span>
                      </div>
                    </div>
                    <CardContent className="space-y-4 p-5">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-zinc-950">{article.title}</h3>
                        <p className="text-sm leading-6 text-zinc-600">{summarizeContent(article.content, 120)}</p>
                      </div>
                      <div className="flex items-center justify-between text-sm text-zinc-500">
                        <span>{article.id}</span>
                        <span className="inline-flex items-center gap-2 font-medium text-zinc-900">
                          Buka artikel
                          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : null}

          {!loading && !error && articles.length > 2 ? (
            <div className="rounded-[1.5rem] border border-emerald-900/10 bg-emerald-50/70 px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-emerald-100 p-2 text-emerald-700">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-950">Masih ada bacaan lain</p>
                  <p className="mt-1 text-sm leading-6 text-emerald-900/80">
                    Katalog penuh punya {articles.length} artikel. Buka halaman penuh untuk filter kategori dan pengalaman kuis lengkap.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
