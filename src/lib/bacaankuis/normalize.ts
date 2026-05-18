import type { ReadingCatalogArticle } from "@/src/components/bacaankuis/ReadingCatalog";
import type { Article, QuizQuestion } from "@/src/lib/api/articles";
import type { MockArticle, MockQuizQuestion } from "@/src/lib/mock/bacaankuis";

const accents = [
  "from-emerald-200 via-lime-100 to-amber-50",
  "from-sky-200 via-cyan-100 to-stone-50",
  "from-amber-200 via-orange-100 to-rose-50",
  "from-violet-200 via-fuchsia-100 to-slate-50",
];

function estimateReadTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 180))} menit`;
}

function summaryFromContent(content: string) {
  const trimmed = content.replace(/\s+/g, " ").trim();
  if (trimmed.length <= 180) {
    return trimmed || "Artikel Yomu siap dibaca dan dikerjakan kuisnya.";
  }

  return `${trimmed.slice(0, 177)}...`;
}

export function parseQuizOptions(options: string[] | string) {
  if (Array.isArray(options)) {
    return options;
  }

  try {
    const parsed = JSON.parse(options);
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
      return parsed;
    }
  } catch {
    return [options];
  }

  return [options];
}

export function articleToCatalogArticle(
  article: Article,
  index: number,
  questions: QuizQuestion[] = [],
): ReadingCatalogArticle {
  return {
    id: article.id,
    title: article.title,
    category: article.category ?? "Umum",
    summary: summaryFromContent(article.content),
    readTime: estimateReadTime(article.content),
    difficulty: questions.length >= 4 ? "Tantangan" : questions.length >= 3 ? "Menengah" : "Pemanasan",
    completionRate: 0,
    accent: accents[index % accents.length],
    insight: questions.length > 0 ? `${questions.length} soal tersedia dari Core API.` : "Kuis belum tersedia.",
    questions,
  };
}

export function articleToReadingArticle(
  article: Article,
  questions: QuizQuestion[],
  index = 0,
): MockArticle {
  const normalizedQuestions: MockQuizQuestion[] = questions.map((question) => ({
    id: question.id,
    question: question.question,
    options: parseQuizOptions(question.options),
    answer: question.answer,
  }));

  return {
    id: article.id,
    title: article.title,
    category: article.category ?? "Umum",
    summary: summaryFromContent(article.content),
    readTime: estimateReadTime(article.content),
    difficulty: normalizedQuestions.length >= 4 ? "Tantangan" : normalizedQuestions.length >= 3 ? "Menengah" : "Pemanasan",
    completionRate: 0,
    accent: accents[index % accents.length],
    insight: normalizedQuestions.length > 0 ? `${normalizedQuestions.length} soal tersedia.` : "Kuis belum tersedia.",
    paragraphs: article.content.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean),
    questions: normalizedQuestions,
  };
}

export function mockToCatalogArticle(article: MockArticle): ReadingCatalogArticle {
  return {
    ...article,
    questions: article.questions,
  };
}
