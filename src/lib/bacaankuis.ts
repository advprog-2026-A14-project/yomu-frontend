export type Article = {
    id: string;
    title: string;
    content: string;
    category: string;
};

export type QuizQuestion = {
    id: string;
    article_id: string;
    question: string;
    options: string;
};

export type SubmitAnswerItem = {
    quiz_id: string;
    answer: string;
};

export type SubmitQuizRequest = {
    answers: SubmitAnswerItem[];
};

export type SubmitQuizResult = {
  score: number;
  accuracy: number;
  correct_count: number;
  total_questions: number;
};

export type QuizResultSnapshot = SubmitQuizResult & {
  article_id: string;
};

export type ArticleCreateRequest = {
  id: string;
  title: string;
  content: string;
  category: string;
};

<<<<<<< HEAD
=======
export type ArticleUpdateRequest = Partial<Omit<ArticleCreateRequest, "id">>;

>>>>>>> d11acafa915e740b6ba9e6680935a006c06844f9
export type QuizCreateRequest = {
  id: string;
  question: string;
  options: string;
  answer: string;
};

export type QuizUpdateRequest = {
  question: string;
  options: string;
  answer: string;
};

export function summarizeContent(content: string, maxLength = 180) {
    const normalized = content.replace(/\s+/g, " ").trim();

    if (normalized.length <= maxLength) {
        return normalized;
    }

    return `${normalized.slice(0, maxLength).trimEnd()}...`;
}

export function estimateReadTime(content: string) {
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 180));
    return `${minutes} menit`;
}

export function splitArticleParagraphs(content: string) {
    return content
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);
}

export function parseQuizOptions(options: string) {
    return options
        .split(";")
        .map((item) => item.trim())
        .filter(Boolean);
}

export function categoryAccent(category: string) {
    const normalized = category.trim().toLowerCase();

    if (normalized.includes("lingkungan")) {
        return "from-emerald-200 via-lime-100 to-amber-50";
    }

    if (normalized.includes("sejarah")) {
        return "from-sky-200 via-cyan-100 to-stone-50";
    }

    if (normalized.includes("sains")) {
        return "from-amber-200 via-orange-100 to-rose-50";
    }

    if (normalized.includes("bahasa")) {
        return "from-violet-200 via-fuchsia-100 to-pink-50";
    }

    return "from-teal-200 via-emerald-100 to-stone-50";
}

export function buildQuizResultStorageKey(articleId: string) {
  return `yomu:bacaankuis:result:${articleId}`;
}
