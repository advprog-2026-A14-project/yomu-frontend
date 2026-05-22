import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, BookOpenText, ChartNoAxesColumn, CircleCheckBig } from "lucide-react";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { YomuShell } from "@/src/components/yomu/YomuShell";
import { categoryAccent } from "@/src/lib/bacaankuis";
import { getArticleById } from "@/src/lib/server/bacaankuis";
import { getCurrentUser } from "@/src/lib/server/session";

type Props = {
  params: Promise<{
    articleId: string;
  }>;
  searchParams: Promise<{
    score?: string;
    accuracy?: string;
    correct?: string;
    total?: string;
    repeat?: string;
  }>;
};

function parseMetric(value?: string) {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatMetric(value: number | null, suffix = "") {
  if (value === null) {
    return "-";
  }

  const rounded = Number(value.toFixed(2));
  return `${rounded}${suffix}`;
}

export default async function ArticleQuizResultPage({ params, searchParams }: Props) {
  const { articleId } = await params;
  const query = await searchParams;
  const userResponse = await getCurrentUser();

  if (!userResponse.success || !("data" in userResponse) || !userResponse.data) {
    redirect("/auth/login");
  }

  const articleResponse = await getArticleById(articleId);

  if (!articleResponse.success || !("data" in articleResponse) || !articleResponse.data) {
    notFound();
  }

  const article = articleResponse.data;
  const score = parseMetric(query.score);
  const accuracy = parseMetric(query.accuracy);
  const correct = parseMetric(query.correct);
  const total = parseMetric(query.total);
  const isRepeatResult = query.repeat === "1";
  const hasResultMetrics = score !== null && accuracy !== null && correct !== null && total !== null;
  const isAdmin = userResponse.data.role === "ADMIN";

  return (
    <YomuShell mode={isAdmin ? "admin" : "learner"}>
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f3efe4_0%,_#f7f8f4_32%,_#edf4ef_100%)] text-zinc-900">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-6 px-5 py-10 md:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white/85 shadow-[0_28px_70px_-40px_rgba(58,94,71,0.42)]">
          <div className={`bg-gradient-to-r ${categoryAccent(article.category)} px-6 py-8 md:px-8`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <Badge variant="outline" className="border-zinc-900/10 bg-white/65 text-zinc-800">
                  {isRepeatResult ? "Hasil tersimpan" : "Ringkasan hasil"}
                </Badge>
                <h1 className="text-3xl leading-tight font-semibold md:text-4xl">
                  {isRepeatResult
                    ? `Kamu sudah pernah menyelesaikan ${article.title}`
                    : `Kamu sudah menuntaskan ${article.title}`}
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-zinc-700 md:text-base">
                  {hasResultMetrics
                    ? isRepeatResult
                      ? "Kuis ini hanya bisa dikerjakan satu kali. Ini adalah hasil terakhir yang tersimpan."
                      : "Jawabanmu sudah dinilai. Nilai di bawah ini adalah hasil final untuk artikel ini."
                    : "Jawaban berhasil dikirim, tetapi ringkasan nilai belum bisa ditampilkan untuk sesi ini."}
                </p>
              </div>

              <div className="rounded-3xl bg-white/70 p-5">
                <div className="flex items-center gap-3">
                  <CircleCheckBig className="size-10 text-emerald-700" />
                  <div>
                    <p className="text-sm text-zinc-600">Status</p>
                    <p className="text-lg font-semibold text-zinc-900">
                      {isRepeatResult ? "Sudah pernah dikerjakan" : "Submit berhasil"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-6 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:py-8">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="border-black/5 bg-zinc-950 text-white">
                <CardContent className="space-y-2 p-6">
                  <p className="text-xs tracking-[0.18em] text-zinc-400 uppercase">Score</p>
                  <p className="text-4xl font-semibold">{formatMetric(score)}</p>
                </CardContent>
              </Card>

              <Card className="border-black/5 bg-white">
                <CardContent className="space-y-2 p-6">
                  <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">Accuracy</p>
                  <p className="text-4xl font-semibold">{formatMetric(accuracy, "%")}</p>
                </CardContent>
              </Card>

              <Card className="border-black/5 bg-white">
                <CardContent className="space-y-2 p-6">
                  <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">Benar</p>
                  <p className="text-4xl font-semibold">
                    {formatMetric(correct)}
                    {total !== null ? ` / ${formatMetric(total)}` : ""}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-emerald-900/10 bg-emerald-50 sm:col-span-3">
                <CardContent className="space-y-3 p-6">
                  <div className="flex items-center gap-3">
                    <ChartNoAxesColumn className="size-5 text-emerald-700" />
                    <p className="font-medium text-emerald-950">Interpretasi singkat</p>
                  </div>
                  <p className="text-sm leading-6 text-emerald-950/80">
                    {hasResultMetrics
                      ? "Hasil ini mengikuti aturan satu kali pengerjaan dan tercatat sebagai progres belajar artikel."
                      : "Ringkasan nilai belum bisa ditampilkan. Kamu tetap bisa kembali ke artikel atau lanjut membaca bacaan lain."}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-black/5 bg-[#fffdf7]">
              <CardContent className="space-y-6 p-6">
                <div className="space-y-2">
                  <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">Kenapa flow ini lebih rapi</p>
                  <h2 className="text-2xl font-semibold">Fokus pada pemahaman, bukan sekadar angka</h2>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <div className="flex items-center gap-3">
                      <BookOpenText className="size-4 text-zinc-700" />
                      <p className="font-medium">Artikel tetap jadi pusat pengalaman</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      Kamu membaca dan menjawab dalam satu alur, lalu melihat hasil akhir setelah sesi selesai.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <p className="font-medium">Admin dan user punya flow yang berbeda</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      User biasa hanya melihat pengalaman baca dan kuis, sedangkan admin mendapat panel kelola konten langsung di halaman artikel.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <p className="font-medium">Jawaban benar tetap terjaga</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      Yomu hanya menampilkan hasil akhir, sehingga pengalaman kuis tetap adil untuk semua pelajar.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <Button asChild variant="outline" className="rounded-full">
                    <Link href={`/bacaankuis/${article.id}`}>
                      <ArrowLeft className="size-4" />
                      Kembali ke artikel
                    </Link>
                  </Button>
                  <Button asChild className="rounded-full bg-zinc-950 text-white hover:bg-zinc-800">
                    <Link href="/bacaankuis">Lihat bacaan lain</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
    </YomuShell>
  );
}
