"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpenText, CheckCircle2, Clock3, MessageCircle, Send } from "lucide-react";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import type { MockArticle } from "@/src/lib/mock/bacaankuis";
import { cn } from "@/src/lib/utils";

type Props = {
  article: MockArticle;
};

export function ReadingQuizExperience({ article }: Props) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = article.questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const completionValue = Math.round((answeredCount / article.questions.length) * 100);
  const selectedAnswer = answers[currentQuestion.id] ?? "";
  const hasFinishedAll = answeredCount === article.questions.length;

  const answeredQuestionNumbers = useMemo(
    () =>
      article.questions.reduce<number[]>((accumulator, question, index) => {
        if (answers[question.id]) {
          accumulator.push(index + 1);
        }

        return accumulator;
      }, []),
    [answers, article.questions],
  );

  const submitQuiz = () => {
    const correctCount = article.questions.filter(
      (question) => answers[question.id] === question.answer,
    ).length;
    const score = Math.round((correctCount / article.questions.length) * 100);
    const accuracy = Number(((correctCount / article.questions.length) * 100).toFixed(1));

    router.push(
      `/bacaankuis/${article.id}/hasil?score=${score}&accuracy=${accuracy}&answered=${answeredCount}`,
    );
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f5f0e6_0%,_#f8f8f6_24%,_#edf4ef_100%)] text-zinc-900">
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
                <Badge className="bg-emerald-700 px-3 py-1 text-white">{article.difficulty}</Badge>
                <h1 className="max-w-3xl text-3xl leading-tight font-semibold text-balance md:text-5xl">
                  {article.title}
                </h1>
                <p className="max-w-3xl text-base leading-7 text-zinc-600">{article.summary}</p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3 lg:w-[28rem]">
              <Card className="border-zinc-100 bg-zinc-50/90 shadow-none">
                <CardContent className="space-y-1 p-4">
                  <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">Waktu baca</p>
                  <p className="text-lg font-semibold">{article.readTime}</p>
                </CardContent>
              </Card>
              <Card className="border-zinc-100 bg-zinc-50/90 shadow-none">
                <CardContent className="space-y-1 p-4">
                  <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">Jumlah soal</p>
                  <p className="text-lg font-semibold">{article.questions.length}</p>
                </CardContent>
              </Card>
              <Card className="border-zinc-100 bg-zinc-50/90 shadow-none">
                <CardContent className="space-y-1 p-4">
                  <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">Aturan</p>
                  <p className="text-lg font-semibold">One take</p>
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

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.82fr]">
          <Card className="overflow-hidden border-black/5 bg-white/82">
            <div className={`h-36 bg-gradient-to-r ${article.accent} px-6 py-5 md:px-8`}>
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-center gap-3 text-zinc-800">
                  <div className="rounded-2xl bg-white/65 p-3">
                    <BookOpenText className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Ruang Baca</p>
                    <p className="text-sm text-zinc-700/80">
                      Fokuskan tampilan bacaan agar tetap nyaman dibaca di desktop maupun mobile.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-zinc-900/10 bg-white/60 text-zinc-800">
                    {article.category}
                  </Badge>
                  <Badge variant="outline" className="border-zinc-900/10 bg-white/60 text-zinc-800">
                    {article.completionRate}% completion
                  </Badge>
                </div>
              </div>
            </div>

            <CardContent className="space-y-6 p-6 md:p-8">
              <div className="rounded-[1.75rem] bg-[#fffdf7] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] ring-1 ring-black/5 md:p-8">
                <div className="mx-auto max-w-3xl space-y-5 font-serif text-[1.05rem] leading-8 text-zinc-700">
                  {article.paragraphs.map((paragraph) => (
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
                    Baca satu paragraf penuh dulu, lalu cocokan pertanyaan dengan ide utama, bukan hanya kata
                    yang tampak mirip.
                  </p>
                </div>

                <div className="rounded-3xl border border-sky-900/10 bg-sky-50/75 p-5">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="size-4 text-sky-700" />
                    <p className="text-sm font-medium text-sky-900">Catatan integrasi</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-sky-900/80">
                    UI ini sudah meniru pola backend Java: submit akhir cukup menghasilkan score dan accuracy.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="sticky top-4 overflow-hidden border-black/5 bg-white/88">
              <CardContent className="space-y-6 p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-zinc-500">
                    <span>Progress pengerjaan</span>
                    <span>{answeredCount}/{article.questions.length} terisi</span>
                  </div>
                  <Progress value={completionValue} className="h-2.5 bg-zinc-100" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {article.questions.map((question, index) => {
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

                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">
                      Soal {currentQuestionIndex + 1} dari {article.questions.length}
                    </p>
                    <h2 className="text-xl leading-8 font-semibold text-zinc-950">
                      {currentQuestion.question}
                    </h2>
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
                    {currentQuestion.options.map((option) => (
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

                <div className="grid gap-3 rounded-3xl bg-zinc-50 p-4">
                  <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">Checkpoint</p>
                  <p className="text-sm leading-6 text-zinc-700">
                    Soal yang sudah terjawab:{" "}
                    {answeredQuestionNumbers.length > 0 ? answeredQuestionNumbers.join(", ") : "belum ada"}
                  </p>
                  <p className="text-sm leading-6 text-zinc-500">
                    Halaman hasil akan menampilkan score dan accuracy seperti payload submit backend.
                  </p>
                </div>

                <div className="flex flex-col gap-3 border-t border-zinc-100 pt-4 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 rounded-full"
                    onClick={() => setCurrentQuestionIndex((index) => Math.max(0, index - 1))}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ArrowLeft className="size-4" />
                    Sebelumnya
                  </Button>

                  {currentQuestionIndex < article.questions.length - 1 ? (
                    <Button
                      type="button"
                      className="flex-1 rounded-full bg-zinc-950 text-white hover:bg-zinc-800"
                      onClick={() =>
                        setCurrentQuestionIndex((index) => Math.min(article.questions.length - 1, index + 1))
                      }
                    >
                      Berikutnya
                      <ArrowRight className="size-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      className="flex-1 rounded-full bg-emerald-700 text-white hover:bg-emerald-800"
                      disabled={!hasFinishedAll}
                      onClick={submitQuiz}
                    >
                      Submit mockup
                      <Send className="size-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-black/5 bg-zinc-950 text-white">
              <CardContent className="space-y-3 p-6">
                <p className="text-xs tracking-[0.18em] text-zinc-400 uppercase">Rule backend</p>
                <p className="text-lg font-semibold">Kuis ini diasumsikan satu kali submit</p>
                <p className="text-sm leading-6 text-zinc-400">
                  Karena service Java menyimpan attempt per artikel dan menolak submit ulang, desain CTA dibuat
                  final dan tegas, bukan draftable berkali-kali.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
