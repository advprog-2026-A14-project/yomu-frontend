"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ReadingQuizExperience } from "@/src/components/bacaankuis/ReadingQuizExperience";
import { Button } from "@/src/components/ui/button";
import { getArticle, getQuizzes, type ReadingArticle } from "@/src/lib/api/reading";
import { getMockArticle } from "@/src/lib/mock/bacaankuis";

type Props = {
  articleId: string;
};

function getFallbackArticle(articleId: string): ReadingArticle | null {
  const article = getMockArticle(articleId);

  return article ? { ...article, source: "mock" } : null;
}

export function ReadingQuizPageClient({ articleId }: Props) {
  const [article, setArticle] = useState<ReadingArticle | null>(() => getFallbackArticle(articleId));
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("Memuat artikel dan kuis dari Java Core...");

  useEffect(() => {
    let active = true;

    const loadArticle = async () => {
      const [articleResponse, quizResponse] = await Promise.all([
        getArticle(articleId),
        getQuizzes(articleId),
      ]);

      if (!active) {
        return;
      }

      if (articleResponse.success && "data" in articleResponse && articleResponse.data) {
        const questions =
          quizResponse.success && "data" in quizResponse && quizResponse.data ? quizResponse.data : [];

        setArticle({
          ...articleResponse.data,
          questions,
        });
        setNotice(
          questions.length > 0
            ? "Data artikel dan kuis aktif dari Java Core."
            : `Artikel aktif dari Java Core, tetapi kuis belum tersedia: ${quizResponse.message}`,
        );
        setLoading(false);
        return;
      }

      const fallback = getFallbackArticle(articleId);
      setArticle(fallback);
      setNotice(`Memakai mock karena backend belum tersedia: ${articleResponse.message}`);
      setLoading(false);
    };

    loadArticle();

    return () => {
      active = false;
    };
  }, [articleId]);

  if (loading && !article) {
    return <main className="p-6">Memuat bacaan...</main>;
  }

  if (!article) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6">
        <h1 className="text-2xl font-semibold">Artikel tidak ditemukan</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Artikel ini tidak ada di backend Java Core maupun data mock frontend.
        </p>
        <Button asChild className="mt-5 w-fit">
          <Link href="/bacaankuis">Kembali ke katalog</Link>
        </Button>
      </main>
    );
  }

  return <ReadingQuizExperience article={article} notice={notice} />;
}
