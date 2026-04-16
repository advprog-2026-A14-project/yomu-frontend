import { notFound } from "next/navigation";

import { ReadingQuizExperience } from "@/src/components/bacaankuis/ReadingQuizExperience";
import { getMockArticle } from "@/src/lib/mock/bacaankuis";

type Props = {
  params: Promise<{
    articleId: string;
  }>;
};

export default async function ArticleQuizPage({ params }: Props) {
  const { articleId } = await params;
  const article = getMockArticle(articleId);

  if (!article) {
    notFound();
  }

  return <ReadingQuizExperience article={article} />;
}
