import { notFound } from "next/navigation";

import { ReadingQuizExperience } from "@/src/components/bacaankuis/ReadingQuizExperience";
import type { Article, QuizQuestion } from "@/src/lib/api/articles";
import { articleToReadingArticle } from "@/src/lib/bacaankuis/normalize";
import { getMockArticle } from "@/src/lib/mock/bacaankuis";
import { coreFetch } from "@/src/lib/server/coreProxy";

type Props = {
  params: Promise<{
    articleId: string;
  }>;
};

export default async function ArticleQuizPage({ params }: Props) {
  const { articleId } = await params;
  const articleResult = await coreFetch<Article>(`/api/v1/articles/${encodeURIComponent(articleId)}`, {
    method: "GET",
  });

  if (articleResult.body.success && "data" in articleResult.body && articleResult.body.data) {
    const quizzesResult = await coreFetch<QuizQuestion[]>(`/api/v1/quizzes/${encodeURIComponent(articleId)}`, {
      method: "GET",
    });
    const questions =
      quizzesResult.body.success && "data" in quizzesResult.body && quizzesResult.body.data
        ? quizzesResult.body.data
        : [];

    return <ReadingQuizExperience article={articleToReadingArticle(articleResult.body.data, questions)} />;
  }

  const fallbackArticle = getMockArticle(articleId);

  if (!fallbackArticle) {
    notFound();
  }

  return <ReadingQuizExperience article={fallbackArticle} />;
}
