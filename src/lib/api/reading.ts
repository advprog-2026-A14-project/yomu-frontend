import { apiFetch } from "./fetcher";

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer?: string;
};

export type ReadingArticle = {
  id: string;
  title: string;
  category: string;
  summary: string;
  readTime: string;
  difficulty: "Pemanasan" | "Menengah" | "Tantangan";
  completionRate: number;
  accent: string;
  insight: string;
  paragraphs: string[];
  questions: QuizQuestion[];
  source: "api" | "mock";
};

type BackendArticle = {
  id?: unknown;
  article_id?: unknown;
  title?: unknown;
  content?: unknown;
  category?: unknown;
  category_name?: unknown;
  summary?: unknown;
};

type BackendQuiz = {
  id?: unknown;
  quiz_id?: unknown;
  article_id?: unknown;
  question?: unknown;
  options?: unknown;
  answer?: unknown;
  correct_answer?: unknown;
};

const accents = [
  "from-emerald-200 via-lime-100 to-amber-50",
  "from-sky-200 via-cyan-100 to-stone-50",
  "from-amber-200 via-orange-100 to-rose-50",
  "from-violet-200 via-fuchsia-100 to-slate-50",
];

function asString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function splitParagraphs(content: string) {
  const paragraphs = content
    .split(/\n{2,}|\r\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (paragraphs.length > 0) {
    return paragraphs;
  }

  return content ? [content] : ["Konten artikel belum tersedia dari backend."];
}

function summarize(content: string, fallbackTitle: string) {
  const normalized = content.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return `Bacaan ${fallbackTitle} siap dibuka.`;
  }

  return normalized.length > 160 ? `${normalized.slice(0, 157).trim()}...` : normalized;
}

function parseOptions(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((option): option is string => typeof option === "string");
  }

  if (typeof value !== "string") {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed.filter((option): option is string => typeof option === "string");
    }
  } catch {
    return value
      .split("|")
      .map((option) => option.trim())
      .filter(Boolean);
  }

  return [];
}

export function normalizeArticle(raw: BackendArticle, index = 0): ReadingArticle | null {
  const id = asString(raw.id ?? raw.article_id);
  const title = asString(raw.title);

  if (!id || !title) {
    return null;
  }

  const content = asString(raw.content);
  const category = asString(raw.category ?? raw.category_name, "Umum");
  const paragraphs = splitParagraphs(content);

  return {
    id,
    title,
    category,
    summary: asString(raw.summary, summarize(content, title)),
    readTime: `${Math.max(3, Math.ceil(content.split(/\s+/).filter(Boolean).length / 180))} menit`,
    difficulty: "Pemanasan",
    completionRate: 0,
    accent: accents[index % accents.length],
    insight: "Artikel ini berasal dari Java Core melalui Next BFF.",
    paragraphs,
    questions: [],
    source: "api",
  };
}

export function normalizeQuiz(raw: BackendQuiz, index = 0): QuizQuestion | null {
  const id = asString(raw.id ?? raw.quiz_id, `quiz-${index + 1}`);
  const question = asString(raw.question);
  const options = parseOptions(raw.options);

  if (!question || options.length === 0) {
    return null;
  }

  const answer = asString(raw.answer ?? raw.correct_answer);

  return {
    id,
    question,
    options,
    answer: answer || undefined,
  };
}

export async function getArticles() {
  const response = await apiFetch<BackendArticle[]>("/api/v1/articles", {
    method: "GET",
  });

  if (!response.success || !("data" in response) || !response.data) {
    return response;
  }

  return {
    ...response,
    data: response.data
      .map((article, index) => normalizeArticle(article, index))
      .filter((article): article is ReadingArticle => Boolean(article)),
  };
}

export async function getArticle(articleId: string) {
  const response = await apiFetch<BackendArticle>(`/api/v1/articles/${articleId}`, {
    method: "GET",
  });

  if (!response.success || !("data" in response) || !response.data) {
    return response;
  }

  const article = normalizeArticle(response.data);

  if (!article) {
    return { success: false as const, message: "Format artikel dari backend tidak valid" };
  }

  return { ...response, data: article };
}

export async function getQuizzes(articleId: string) {
  const response = await apiFetch<BackendQuiz[]>(`/api/v1/quizzes/${articleId}`, {
    method: "GET",
  });

  if (!response.success || !("data" in response) || !response.data) {
    return response;
  }

  return {
    ...response,
    data: response.data
      .map((quiz, index) => normalizeQuiz(quiz, index))
      .filter((quiz): quiz is QuizQuestion => Boolean(quiz)),
  };
}

export async function submitQuiz(articleId: string, score: number, accuracy: number) {
  return apiFetch<unknown>(`/api/v1/quizzes/${articleId}/submit`, {
    method: "POST",
    body: JSON.stringify({
      score,
      accuracy,
    }),
  });
}
