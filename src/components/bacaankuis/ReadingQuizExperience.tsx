"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  MessageCircle,
} from "lucide-react";

import { ArticleAdminPanel } from "@/src/components/bacaankuis/ArticleAdminPanel";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { submitQuizWithStatus } from "@/src/lib/api/bacaankuis";
import type { Article, QuizQuestion, QuizResultSnapshot } from "@/src/lib/bacaankuis";
import {
  buildQuizResultStorageKey,
  categoryAccent,
  estimateReadTime,
  parseQuizOptions,
  splitArticleParagraphs,
} from "@/src/lib/bacaankuis";
import { cn } from "@/src/lib/utils";

type Props = {
  article: Article;
  questions: QuizQuestion[];
  isAdmin?: boolean;
  adminName?: string | null;
  quizMessage?: string | null;
};

function readCachedResult(articleId: string): QuizResultSnapshot | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(buildQuizResultStorageKey(articleId));

    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue) as Partial<QuizResultSnapshot>;

    if (
      parsed &&
      parsed.article_id === articleId &&
      typeof parsed.score === "number" &&
      typeof parsed.accuracy === "number" &&
      typeof parsed.correct_count === "number" &&
      typeof parsed.total_questions === "number"
    ) {
      return parsed as QuizResultSnapshot;
    }
  } catch {
    return null;
  }

  return null;
}

export function ReadingQuizExperience({
  article,
  questions,
  isAdmin,
  adminName,
  quizMessage,
}: Props) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cachedResult, setCachedResult] = useState<QuizResultSnapshot | null>(() => readCachedResult(article.id));

  const currentQuestion = questions[currentQuestionIndex] ?? null;
  const paragraphs = splitArticleParagraphs(article.content);
  const quizUnavailable = questions.length === 0;
  const answeredCount = Object.keys(answers).length;
  const completionValue = questions.length === 0 ? 0 : Math.round((answeredCount / questions.length) * 100);
  const selectedAnswer = currentQuestion ? answers[currentQuestion.id] ?? "" : "";
  const hasFinishedAll = questions.length > 0 && answeredCount === questions.length;

  const answeredQuestionNumbers = useMemo(
    () =>
      questions.reduce<number[]>((accumulator, question, index) => {
        if (answers[question.id]) {
          accumulator.push(index + 1);
        }

        return accumulator;
      }, []),
    [answers, questions],
  );

  const pushToResultPage = (result: QuizResultSnapshot, repeat = false) => {
    const params = new URLSearchParams({
      score: String(result.score),
      accuracy: String(result.accuracy),
      correct: String(result.correct_count),
      total: String(result.total_questions),
    });

    if (repeat) {
      params.set("repeat", "1");
    }

    router.push(`/bacaankuis/${article.id}/hasil?${params.toString()}`);
  };

  const finishSession = async () => {
    if (!hasFinishedAll) {
      setSubmitError("Semua soal perlu dijawab sebelum dikirim.");
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    const result = await submitQuizWithStatus(article.id, {
      answers: questions.map((question) => ({
        quiz_id: question.id,
        answer: answers[question.id],
      })),
    });

    setIsSubmitting(false);

    const { status, response } = result;

    if (status === 409 && "data" in response && response.data) {
      const snapshot: QuizResultSnapshot = {
        article_id: article.id,
        score: response.data.score,
        accuracy: response.data.accuracy,
        correct_count: response.data.correct_count,
        total_questions: response.data.total_questions,
      };

      window.localStorage.setItem(buildQuizResultStorageKey(article.id), JSON.stringify(snapshot));
      setCachedResult(snapshot);
      pushToResultPage(snapshot, true);
      return;
    }

    if (!response.success) {
      setSubmitError(
        status === 409 && cachedResult
          ? "Kuis untuk artikel ini sudah pernah kamu selesaikan. Hasil terakhir bisa dibuka dari tombol di bawah."
          : status === 409
            ? "Kuis untuk artikel ini sudah pernah kamu selesaikan."
            : response.message,
      );
      return;
    }

    if (!("data" in response) || !response.data) {
      setSubmitError("Jawaban berhasil dikirim, tetapi ringkasan nilai belum bisa ditampilkan.");
      return;
    }

    const snapshot: QuizResultSnapshot = {
      article_id: article.id,
      score: response.data.score,
      accuracy: response.data.accuracy,
      correct_count: response.data.correct_count,
      total_questions: response.data.total_questions,
    };

    window.localStorage.setItem(buildQuizResultStorageKey(article.id), JSON.stringify(snapshot));
    setCachedResult(snapshot);
    pushToResultPage(snapshot);
  };

  const quizNotice = quizMessage ?? (quizUnavailable ? "Kuis untuk artikel ini belum dibuka." : null);
  const hasRepeatMessage = quizMessage?.toLowerCase().includes("sudah");

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f5f0e6_0%,_#f8f8f6_24%,_#edf4ef_100%)] text-zinc-900">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-6 md:px-8 md:py-8">
        <div className="rounded-[2rem] border border-black/5 bg-white/80 px-5 py-5 shadow-[0_28px_70px_-42px_rgba(59,86,64,0.42)] backdrop-blur md:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500">
                <Link href="/bacaankuis" className="inline-flex items-center gap-2 hover:text-zinc-900">
                  <ArrowLeft className="size-4" />
                  Kembali ke katalog
                </Link>
                <span className="hidden md:inline">/</span>
                <span>{article.category}</span>
              </div>

              <div className="space-y-3">
                <Badge className="bg-emerald-700 px-3 py-1 text-white">{article.category}</Badge>
                <h1 className="max-w-3xl text-3xl leading-tight font-semibold text-balance md:text-5xl">
                  {article.title}
                </h1>
                <p className="max-w-3xl text-base leading-7 text-zinc-600">
                  Baca dengan tenang, lalu lanjutkan ke kuis dan diskusi tanpa keluar dari konteks artikel.
                </p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3 lg:w-[28rem]">
              <Card className="border-zinc-100 bg-zinc-50/90 shadow-none">
                <CardContent className="space-y-1 p-4">
                  <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">Waktu baca</p>
                  <p className="text-lg font-semibold">{estimateReadTime(article.content)}</p>
                </CardContent>
              </Card>
              <Card className="border-zinc-100 bg-zinc-50/90 shadow-none">
                <CardContent className="space-y-1 p-4">
                  <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">Jumlah soal</p>
                  <p className="text-lg font-semibold">{questions.length}</p>
                </CardContent>
              </Card>
              <Card className="border-zinc-100 bg-zinc-50/90 shadow-none">
                <CardContent className="space-y-1 p-4">
                  <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">Mode</p>
                  <p className="text-lg font-semibold">{isAdmin ? "Admin view" : "Learner view"}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <Button asChild variant="outline" className="rounded-full border-zinc-200 bg-white/75">
              <Link href={`/forums/${article.id}`}>
                <MessageCircle className="size-4" />
                Diskusi
              </Link>
            </Button>
          </div>
        </div>

        {isAdmin && adminName ? (
          <ArticleAdminPanel
            articleId={article.id}
            articleTitle={article.title}
            adminName={adminName}
            quizzes={questions}
          />
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(22rem,0.78fr)]">
          <Card className="overflow-hidden border-black/5 bg-white/82">
            <div className={`h-36 bg-gradient-to-r ${categoryAccent(article.category)} px-6 py-5 md:px-8`}>
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-center gap-3 text-zinc-800">
                  <div className="rounded-2xl bg-white/65 p-3">
                    <BookOpenText className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Ruang baca</p>
                    <p className="text-sm text-zinc-700/80">
                      Fokuskan bacaan dulu, lalu jawab soal di panel samping tanpa kehilangan konteks.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-zinc-900/10 bg-white/60 text-zinc-800">
                    {article.category}
                  </Badge>
                  <Badge variant="outline" className="border-zinc-900/10 bg-white/60 text-zinc-800">
                    {questions.length} soal tersedia
                  </Badge>
                </div>
              </div>
            </div>

            <CardContent className="space-y-6 p-6 md:p-8">
              <div className="rounded-[1.75rem] bg-[#fffdf7] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] ring-1 ring-black/5 md:p-8">
                <div className="mx-auto max-w-3xl space-y-5 font-serif text-[1.05rem] leading-8 text-zinc-700">
                  {paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
                <div className="rounded-3xl border border-emerald-900/10 bg-emerald-50/70 p-5">
                  <div className="flex items-center gap-3">
                    <Clock3 className="size-4 text-emerald-700" />
                    <p className="text-sm font-medium text-emerald-900">Tips membaca</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-emerald-900/80">
                    Baca satu paragraf penuh dulu, lalu cocokkan pertanyaan dengan ide utama, bukan hanya kata yang tampak mirip.
                  </p>
                </div>

                <div className="rounded-3xl border border-sky-900/10 bg-sky-50/75 p-5">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="size-4 text-sky-700" />
                    <p className="text-sm font-medium text-sky-900">Catatan integrasi</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-sky-900/80">
                    Jawabanmu dinilai setelah semua soal dikirim.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="overflow-hidden border-black/5 bg-white/88 xl:sticky xl:top-24">
              <CardContent className="space-y-6 p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-zinc-500">
                    <span>Progress pengerjaan</span>
                    <span>{answeredCount}/{questions.length} terisi</span>
                  </div>
                  <Progress value={completionValue} className="h-2.5 bg-zinc-100" />
                </div>

                {quizNotice ? (
                  <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
                    <div className="flex items-start gap-3">
                      {quizMessage?.toLowerCase().includes("login") || quizMessage === "Unauthorized" ? (
                        <LockKeyhole className="mt-0.5 size-5 text-amber-700" />
                      ) : (
                        <AlertTriangle className="mt-0.5 size-5 text-amber-700" />
                      )}
                      <div className="space-y-2">
                        <p className="font-medium text-amber-950">Kuis belum bisa dibuka</p>
                        <p className="text-sm leading-6 text-amber-900/80">{quizNotice}</p>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  {questions.map((question, index) => {
                    const isCurrent = index === currentQuestionIndex;
                    const isAnswered = Boolean(answers[question.id]);

                    return (
                      <button
                        key={question.id}
                        type="button"
                        className={cn(
                          "flex size-10 items-center justify-center rounded-full border text-sm transition",
                          isCurrent
                            ? "border-zinc-950 bg-zinc-950 text-white"
                            : isAnswered
                              ? "border-emerald-700/20 bg-emerald-50 text-emerald-800"
                              : "border-zinc-200 bg-white text-zinc-600",
                        )}
                        onClick={() => setCurrentQuestionIndex(index)}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>

                {currentQuestion ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">
                        Soal {currentQuestionIndex + 1} dari {questions.length}
                      </p>
                      <h2 className="text-xl leading-8 font-semibold text-zinc-950">{currentQuestion.question}</h2>
                    </div>

                    <RadioGroup
                      value={selectedAnswer}
                      onValueChange={(value) =>
                        setAnswers((current) => ({
                          ...current,
                          [currentQuestion.id]: value,
                        }))
                      }
                      className="space-y-3"
                    >
                      {parseQuizOptions(currentQuestion.options).map((option) => (
                        <label
                          key={option}
                          className={cn(
                            "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition",
                            selectedAnswer === option
                              ? "border-zinc-950 bg-zinc-950 text-white"
                              : "border-zinc-200 bg-zinc-50/80 text-zinc-700 hover:border-zinc-300",
                          )}
                        >
                          <RadioGroupItem value={option} className="mt-1 border-current text-current" />
                          <span className="text-sm leading-6">{option}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                ) : null}

                <div className="grid gap-3 rounded-3xl bg-zinc-50 p-4">
                  <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">Checkpoint</p>
                  <p className="text-sm leading-6 text-zinc-700">
                    Soal yang sudah terjawab: {answeredQuestionNumbers.length > 0 ? answeredQuestionNumbers.join(", ") : "belum ada"}
                  </p>
                  <p className="text-sm leading-6 text-zinc-500">
                    Nilai akhir akan muncul setelah semua jawaban dikirim.
                  </p>
                  {hasRepeatMessage && cachedResult ? (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                      <p className="text-sm leading-6 text-emerald-900">
                        Hasil terakhir tersimpan di browser ini: score {cachedResult.score}, accuracy {cachedResult.accuracy}%.
                      </p>
                    </div>
                  ) : null}
                </div>

                {submitError ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p> : null}

                {hasRepeatMessage && cachedResult ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-full border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                    onClick={() => pushToResultPage(cachedResult, true)}
                  >
                    Lihat hasil terakhir
                  </Button>
                ) : null}

                <div className="flex flex-col gap-3 border-t border-zinc-100 pt-4 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 rounded-full"
                    onClick={() => setCurrentQuestionIndex((index) => Math.max(0, index - 1))}
                    disabled={quizUnavailable || currentQuestionIndex === 0}
                  >
                    <ArrowLeft className="size-4" />
                    Sebelumnya
                  </Button>

                  {currentQuestionIndex < questions.length - 1 ? (
                    <Button
                      type="button"
                      className="flex-1 rounded-full bg-zinc-950 text-white hover:bg-zinc-800"
                      onClick={() => setCurrentQuestionIndex((index) => Math.min(questions.length - 1, index + 1))}
                    >
                      Berikutnya
                      <ArrowRight className="size-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      className="flex-1 rounded-full bg-emerald-700 text-white hover:bg-emerald-800"
                      disabled={quizUnavailable || !hasFinishedAll || isSubmitting}
                      onClick={finishSession}
                    >
                      {isSubmitting ? "Mengirim jawaban..." : "Kirim jawaban"}
                      <CheckCircle2 className="size-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-black/5 bg-zinc-950 text-white">
              <CardContent className="space-y-3 p-6">
                <p className="text-xs tracking-[0.18em] text-zinc-400 uppercase">Aturan kuis</p>
                <p className="text-lg font-semibold">Kuis hanya dikirim satu kali per artikel</p>
                <p className="text-sm leading-6 text-zinc-400">
                  Setelah jawaban dikirim, hasil akhir akan tersimpan sebagai progres belajarmu.
                </p>
                <div className="pt-2">
                  <Link href={`/forums/${article.id}`} className="text-sm text-emerald-300 hover:text-emerald-200">
                    Lanjut ke diskusi artikel
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
