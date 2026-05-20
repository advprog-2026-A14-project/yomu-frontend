"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, MessageSquareText, Sparkles } from "lucide-react";

import { getArticles } from "@/src/lib/api/bacaankuis";
import { getComments, type Comment } from "@/src/lib/api/forum";
import type { Article } from "@/src/lib/bacaankuis";
import { summarizeContent } from "@/src/lib/bacaankuis";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";

type ForumPreviewItem = {
  article: Article;
  topLevelCount: number;
  totalCount: number;
  latestSnippet: string | null;
};

function countComments(comments: Comment[]) {
  return comments.reduce(
    (total, comment) => total + 1 + countComments(comment.replies ?? []),
    0,
  );
}

function findLatestSnippet(comments: Comment[]) {
  const flatComments: Comment[] = [];

  const walk = (items: Comment[]) => {
    items.forEach((comment) => {
      flatComments.push(comment);
      walk(comment.replies ?? []);
    });
  };

  walk(comments);

  const latest = flatComments.sort(
    (left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
  )[0];

  return latest ? summarizeContent(latest.content, 88) : null;
}

export function DashboardForumPreview() {
  const [items, setItems] = useState<ForumPreviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadForumPreview = async () => {
      const articlesResponse = await getArticles();

      if (!active) {
        return;
      }

      if (!articlesResponse.success || !("data" in articlesResponse) || !articlesResponse.data) {
        setError(articlesResponse.message);
        setLoading(false);
        return;
      }

      const previewArticles = articlesResponse.data.slice(0, 2);

      const commentResponses = await Promise.all(
        previewArticles.map(async (article) => ({
          article,
          response: await getComments(article.id),
        })),
      );

      if (!active) {
        return;
      }

      const nextItems = commentResponses.map(({ article, response }) => {
        const comments = response.success && "data" in response && response.data ? response.data : [];

        return {
          article,
          topLevelCount: comments.length,
          totalCount: countComments(comments),
          latestSnippet: findLatestSnippet(comments),
        };
      });

      setItems(nextItems);
      setError(null);
      setLoading(false);
    };

    void loadForumPreview();

    return () => {
      active = false;
    };
  }, []);

  const activeThreads = useMemo(
    () => items.filter((item) => item.totalCount > 0).length,
    [items],
  );

  return (
    <section className="rounded-[2rem] border border-black/5 bg-white/82 shadow-[0_28px_70px_-42px_rgba(59,86,64,0.28)]">
      <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5 border-b border-zinc-200/70 bg-[linear-gradient(135deg,_rgba(236,243,255,0.94),_rgba(247,250,243,0.82))] px-6 py-7 lg:border-r lg:border-b-0 lg:px-8 lg:py-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/75 p-3 text-sky-700">
              <MessageSquareText className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900">Forum Artikel</p>
              <p className="text-sm text-zinc-600">Preview diskusi yang menempel ke tiap artikel</p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="max-w-xl text-3xl leading-tight font-semibold text-zinc-950">
              Setelah baca dan kuis, lanjutkan percakapan di ruang diskusi artikel.
            </h2>
            <p className="max-w-xl text-sm leading-7 text-zinc-600">
              Forum membantu pelajar saling membandingkan pemahaman, bertanya, atau menyorot poin penting dari artikel yang baru dibaca.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {items[0] ? (
              <Button asChild className="rounded-full bg-zinc-950 text-white hover:bg-zinc-800">
                <Link href={`/forums/${items[0].article.id}`}>
                  Buka diskusi pertama
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild className="rounded-full bg-zinc-950 text-white hover:bg-zinc-800">
                <Link href="/bacaankuis">Cari artikel untuk didiskusikan</Link>
              </Button>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-sky-900/10 bg-white/70 px-4 py-4">
              <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">Thread aktif</p>
              <p className="mt-2 text-3xl font-semibold text-zinc-950">{activeThreads}</p>
            </div>
            <div className="rounded-[1.5rem] border border-sky-900/10 bg-white/70 px-4 py-4">
              <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">Preview artikel</p>
              <p className="mt-2 text-3xl font-semibold text-zinc-950">{items.length}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-6 py-7 lg:px-8 lg:py-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-900">Cuplikan diskusi</p>
              <p className="text-sm text-zinc-500">Diambil dari forum per artikel yang sudah tersedia</p>
            </div>
            <div className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800">
              {activeThreads} aktif
            </div>
          </div>

          {loading ? (
            <div className="rounded-[1.5rem] border border-dashed border-zinc-300 bg-zinc-50 px-5 py-8 text-sm text-zinc-500">
              Memuat preview forum...
            </div>
          ) : null}

          {error ? (
            <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-8 text-sm leading-6 text-red-700">
              {error}
            </div>
          ) : null}

          {!loading && !error && items.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-zinc-300 bg-zinc-50 px-5 py-8 text-sm text-zinc-500">
              Belum ada artikel untuk preview forum.
            </div>
          ) : null}

          {!loading && !error ? (
            <div className="grid gap-4">
              {items.map((item) => (
                <Link key={item.article.id} href={`/forums/${item.article.id}`} className="group block">
                  <Card className="border-black/5 bg-white transition-transform duration-300 hover:-translate-y-1">
                    <CardContent className="space-y-4 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-2">
                          <Badge variant="outline" className="border-zinc-900/10 bg-zinc-50 text-zinc-700">
                            {item.article.category}
                          </Badge>
                          <h3 className="text-xl font-semibold text-zinc-950">{item.article.title}</h3>
                        </div>
                        <div className="rounded-full bg-zinc-50 px-3 py-1 text-xs text-zinc-700">
                          {item.totalCount} komentar
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-[0.7fr_1.3fr]">
                        <div className="rounded-2xl bg-zinc-50 px-4 py-4">
                          <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">Ringkasan</p>
                          <p className="mt-2 text-sm leading-6 text-zinc-700">
                            {item.topLevelCount} komentar utama
                          </p>
                        </div>
                        <div className="rounded-2xl bg-sky-50/70 px-4 py-4">
                          <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">Komentar terbaru</p>
                          <p className="mt-2 text-sm leading-6 text-zinc-700">
                            {item.latestSnippet ?? "Belum ada komentar. Jadilah yang pertama memulai diskusi."}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-zinc-500">
                        <span>{item.article.id}</span>
                        <span className="inline-flex items-center gap-2 font-medium text-zinc-900">
                          Buka diskusi
                          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : null}

          {!loading && !error && activeThreads === 0 ? (
            <div className="rounded-[1.5rem] border border-sky-900/10 bg-sky-50/70 px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-sky-100 p-2 text-sky-700">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-sky-950">Diskusi masih sepi</p>
                  <p className="mt-1 text-sm leading-6 text-sky-900/80">
                    Ini kesempatan bagus buat memulai komentar pertama setelah selesai membaca artikel.
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
