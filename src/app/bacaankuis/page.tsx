import { redirect } from "next/navigation";

import { ReadingCatalog } from "@/src/components/bacaankuis/ReadingCatalog";
<<<<<<< HEAD
=======
import { YomuShell } from "@/src/components/yomu/YomuShell";
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9
import { getArticles } from "@/src/lib/server/bacaankuis";
import { getCurrentUser } from "@/src/lib/server/session";

type Props = {
  searchParams: Promise<{
    category?: string;
  }>;
};

export default async function BacaanKuisPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const userResponse = await getCurrentUser();

  if (!userResponse.success || !("data" in userResponse) || !userResponse.data) {
    redirect("/auth/login");
  }

  const [articlesResponse, allArticlesResponse] = await Promise.all([
    getArticles(category),
    getArticles(),
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
    userResponse.data.role === "ADMIN";

  const adminName = userResponse.data.display_name;

  return (
<<<<<<< HEAD
    <ReadingCatalog
      articles={articles}
      categories={categories}
      activeCategory={category}
      error={articlesResponse.success ? null : articlesResponse.message}
      isAdmin={isAdmin}
      adminName={adminName}
    />
=======
    <YomuShell mode={isAdmin ? "admin" : "learner"}>
      <ReadingCatalog
        articles={articles}
        categories={categories}
        activeCategory={category}
        error={articlesResponse.success ? null : articlesResponse.message}
        isAdmin={isAdmin}
        adminName={adminName}
      />
    </YomuShell>
>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9
  );
}
