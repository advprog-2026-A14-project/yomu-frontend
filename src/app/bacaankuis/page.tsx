import { ReadingCatalog } from "@/src/components/bacaankuis/ReadingCatalog";
import type { Article, QuizQuestion } from "@/src/lib/api/articles";
import { articleToCatalogArticle, mockToCatalogArticle } from "@/src/lib/bacaankuis/normalize";
import { mockArticles } from "@/src/lib/mock/bacaankuis";
import { coreFetch } from "@/src/lib/server/coreProxy";

export default async function BacaanKuisPage() {
  const articlesResult = await coreFetch<Article[]>("/api/v1/articles", {
    method: "GET",
  });

  if (!articlesResult.body.success || !("data" in articlesResult.body) || !articlesResult.body.data) {
    return (
      <ReadingCatalog
        articles={mockArticles.map(mockToCatalogArticle)}
        error={`${articlesResult.body.message}. Menampilkan data contoh sampai Core API aktif.`}
      />
    );
  }

  const articles = await Promise.all(
    articlesResult.body.data.map(async (article, index) => {
      const quizzesResult = await coreFetch<QuizQuestion[]>(`/api/v1/quizzes/${encodeURIComponent(article.id)}`, {
        method: "GET",
      });

      const questions =
        quizzesResult.body.success && "data" in quizzesResult.body && quizzesResult.body.data
          ? quizzesResult.body.data
          : [];

      return articleToCatalogArticle(article, index, questions);
    }),
  );

  return <ReadingCatalog articles={articles} />;
}
