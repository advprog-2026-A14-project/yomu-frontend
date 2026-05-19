import { ReadingQuizPageClient } from "@/src/components/bacaankuis/ReadingQuizPageClient";

type Props = {
  params: Promise<{
    articleId: string;
  }>;
};

export default async function ArticleQuizPage({ params }: Props) {
  const { articleId } = await params;

  return <ReadingQuizPageClient articleId={articleId} />;
}
