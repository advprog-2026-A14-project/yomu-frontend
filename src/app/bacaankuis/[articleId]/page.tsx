import { notFound, redirect } from "next/navigation";

import { ReadingQuizExperience } from "@/src/components/bacaankuis/ReadingQuizExperience";
import { getArticleById, getQuizQuestions } from "@/src/lib/server/bacaankuis";
import { getCurrentUser } from "@/src/lib/server/session";

type Props = {
  params: Promise<{
    articleId: string;
  }>;
};

export default async function ArticleQuizPage({ params }: Props) {
  const { articleId } = await params;
  const userResponse = await getCurrentUser();

  if (!userResponse.success || !("data" in userResponse) || !userResponse.data) {
    redirect("/auth/login");
  }

  const [articleResponse, quizResponse] = await Promise.all([
    getArticleById(articleId),
    getQuizQuestions(articleId),
  ]);

  if (!articleResponse.success || !("data" in articleResponse) || !articleResponse.data) {
    notFound();
  }

  const questions =
    quizResponse.success && "data" in quizResponse && quizResponse.data ? quizResponse.data : [];

  const isAdmin =
    userResponse.data.role === "ADMIN";

  const adminName = userResponse.data.display_name;

  return (
    <ReadingQuizExperience
      article={articleResponse.data}
      questions={questions}
      isAdmin={isAdmin}
      adminName={adminName}
      quizMessage={quizResponse.success ? null : quizResponse.message}
    />
  );
}
