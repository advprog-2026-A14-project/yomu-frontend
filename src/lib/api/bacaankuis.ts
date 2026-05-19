import { apiFetch } from "./fetcher";
import type { SubmitQuizPayload } from "@/src/lib/bacaankuis";

export async function submitQuiz(articleId: string, payload: SubmitQuizPayload) {
  return apiFetch<never>(`/api/v1/quizzes/${articleId}/submit`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
