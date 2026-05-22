import { apiFetch, apiFetchWithStatus } from "./fetcher";
import type {
  Article,
  ArticleCreateRequest,
  ArticleUpdateRequest,
  QuizQuestion,
  QuizCreateRequest,
  QuizUpdateRequest,
  SubmitQuizRequest,
  SubmitQuizResult,
} from "@/src/lib/bacaankuis";

export async function getArticles(category?: string) {
    const query = category ? `?category=${encodeURIComponent(category)}` : "";

    return apiFetch<Article[]>(`/api/v1/articles${query}`, {
        method: "GET",
    });
}

export async function getArticle(articleId: string) {
    return apiFetch<Article>(`/api/v1/articles/${articleId}`, {
        method: "GET",
    });
}

export async function getQuizzes(articleId: string) {
    return apiFetch<QuizQuestion[]>(`/api/v1/quizzes/${articleId}`, {
        method: "GET",
    });
}

export async function submitQuiz(articleId: string, payload: SubmitQuizRequest) {
  return apiFetch<SubmitQuizResult>(`/api/v1/quizzes/${articleId}/submit`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function submitQuizWithStatus(articleId: string, payload: SubmitQuizRequest) {
  return apiFetchWithStatus<SubmitQuizResult>(`/api/v1/quizzes/${articleId}/submit`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function adminCreateArticle(payload: ArticleCreateRequest) {
  return apiFetch<Article>("/api/v1/admin/articles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function adminDeleteArticle(articleId: string) {
  return apiFetch<never>(`/api/v1/admin/articles/${articleId}`, {
    method: "DELETE",
  });
}

export async function adminUpdateArticle(articleId: string, payload: ArticleUpdateRequest) {
  return apiFetch<Article>(`/api/v1/admin/articles/${articleId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function adminCreateQuiz(articleId: string, payload: QuizCreateRequest) {
  return apiFetch<QuizQuestion>(`/api/v1/admin/articles/${articleId}/quizzes`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function adminUpdateQuiz(quizId: string, payload: QuizUpdateRequest) {
  return apiFetch<QuizQuestion>(`/api/v1/admin/quizzes/${quizId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function adminDeleteQuiz(quizId: string) {
  return apiFetch<never>(`/api/v1/admin/quizzes/${quizId}`, {
    method: "DELETE",
  });
}
