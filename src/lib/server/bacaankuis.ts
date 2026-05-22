import "server-only";

import type { ApiResponse } from "@/src/lib/api/types";
import type { Article, QuizQuestion } from "@/src/lib/bacaankuis";
import { getAuthToken } from "@/src/lib/server/auth";
import { coreFetch } from "@/src/lib/server/coreProxy";

export async function getArticles(category?: string): Promise<ApiResponse<Article[]>> {
  const token = await getAuthToken();

  if (!token) {
    return {
      success: false,
      message: "Login diperlukan untuk mengakses bacaan",
    };
  }

  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  const result = await coreFetch<Article[]>(`/api/v1/articles${query}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  return result.body;
}

export async function getArticleById(articleId: string): Promise<ApiResponse<Article>> {
  const token = await getAuthToken();

  if (!token) {
    return {
      success: false,
      message: "Login diperlukan untuk mengakses bacaan",
    };
  }

  const result = await coreFetch<Article>(`/api/v1/articles/${encodeURIComponent(articleId)}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  return result.body;
}

export async function getQuizQuestions(articleId: string): Promise<ApiResponse<QuizQuestion[]>> {
  const token = await getAuthToken();

  if (!token) {
    return {
      success: false,
      message: "Login diperlukan untuk mengakses kuis",
    };
  }

  const result = await coreFetch<QuizQuestion[]>(
    `/api/v1/quizzes/${encodeURIComponent(articleId)}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return result.body;
}
