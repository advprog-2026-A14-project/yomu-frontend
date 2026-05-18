import { apiFetch } from "./fetcher";

export type Article = {
  id: string;
  title: string;
  content: string;
  category?: string | null;
};

export type QuizQuestion = {
  id: string;
  article_id: string;
  question: string;
  options: string[] | string;
  answer?: string;
};

export type QuizSubmitResult = {
  user_id?: string;
  article_id?: string;
  score?: number;
  accuracy?: number;
  [key: string]: unknown;
};

export async function getArticles(category?: string) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";

  return apiFetch<Article[]>(`/api/v1/articles${query}`, {
    method: "GET",
  });
}

export async function getArticle(articleId: string) {
  return apiFetch<Article>(`/api/v1/articles/${encodeURIComponent(articleId)}`, {
    method: "GET",
  });
}

export async function getQuizzes(articleId: string) {
  return apiFetch<QuizQuestion[]>(`/api/v1/quizzes/${encodeURIComponent(articleId)}`, {
    method: "GET",
  });
}

export async function submitQuiz(articleId: string, score: number, accuracy: number) {
  return apiFetch<QuizSubmitResult>(`/api/v1/quizzes/${encodeURIComponent(articleId)}/submit`, {
    method: "POST",
    body: JSON.stringify({
      score,
      accuracy,
    }),
  });
}
