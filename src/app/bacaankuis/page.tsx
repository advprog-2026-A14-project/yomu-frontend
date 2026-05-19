import { ReadingCatalog } from "@/src/components/bacaankuis/ReadingCatalog";
import { getArticles } from "@/src/lib/server/bacaankuis";
import { getCurrentUser } from "@/src/lib/server/session";

type Props = {
  searchParams: Promise<{
    category?: string;
  }>;
};

export default async function BacaanKuisPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const [articlesResponse, allArticlesResponse, userResponse] = await Promise.all([
    getArticles(category),
    getArticles(),
    getCurrentUser(),
  ]);

  const categories =
    allArticlesResponse.success && "data" in allArticlesResponse && allArticlesResponse.data
      ? [...new Set(allArticlesResponse.data.map((article) => article.category).filter(Boolean))].sort((a, b) =>
          a.localeCompare(b),
        )
      : [];

  const articles =
    articlesResponse.success && "data" in articlesResponse && articlesResponse.data
      ? articlesResponse.data
      : [];

  const isAdmin =
    userResponse.success && "data" in userResponse && userResponse.data
      ? userResponse.data.role === "ADMIN"
      : false;

  const adminName =
    userResponse.success && "data" in userResponse && userResponse.data
      ? userResponse.data.display_name
      : null;

  return (
    <ReadingCatalog
      articles={articles}
      categories={categories}
      activeCategory={category}
      error={articlesResponse.success ? null : articlesResponse.message}
      isAdmin={isAdmin}
      adminName={adminName}
    />
  );
}
