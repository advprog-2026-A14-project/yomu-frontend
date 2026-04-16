import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpenText, ChartNoAxesColumn, CircleCheckBig } from "lucide-react";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { getMockArticle } from "@/src/lib/mock/bacaankuis";

type Props = {
  params: Promise<{
    articleId: string;
  }>;
  searchParams: Promise<{
    score?: string;
    accuracy?: string;
    answered?: string;
  }>;
};

export default async function ArticleQuizResultPage({ params, searchParams }: Props) {
  const { articleId } = await params;
  const query = await searchParams;
  const article = getMockArticle(articleId);

  if (!article) {
    notFound();
  }

  const score = Number(query.score ?? 0);
  const accuracy = Number(query.accuracy ?? 0);
  const answered = Number(query.answered ?? 0);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f3efe4_0%,_#f7f8f4_32%,_#edf4ef_100%)] text-zinc-900">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-6 px-5 py-10 md:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white/85 shadow-[0_28px_70px_-40px_rgba(58,94,71,0.42)]">
          <div className={`bg-gradient-to-r ${article.accent} px-6 py-8 md:px-8`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <Badge variant="outline" className="border-zinc-900/10 bg-white/65 text-zinc-800">
                  Hasil Mockup
                </Badge>
                <h1 className="text-3xl leading-tight font-semibold md:text-4xl">
                  Kamu sudah menuntaskan {article.title}
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-zinc-700 md:text-base">
                  Tampilan ini meniru state setelah `POST /api/v1/quizzes/{articleId}/submit`: frontend
                  merangkum score, accuracy, dan status attempt akhir.
                </p>
              </div>

              <div className="rounded-3xl bg-white/70 p-5">
                <div className="flex items-center gap-3">
                  <CircleCheckBig className="size-10 text-emerald-700" />
                  <div>
                    <p className="text-sm text-zinc-600">Status</p>
                    <p className="text-lg font-semibold text-zinc-900">Sudah dikerjakan</p>
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
                  <p className="text-4xl font-semibold">{score}</p>
                </CardContent>
              </Card>

              <Card className="border-black/5 bg-white">
                <CardContent className="space-y-2 p-6">
                  <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">Accuracy</p>
                  <p className="text-4xl font-semibold">{accuracy}%</p>
                </CardContent>
              </Card>

              <Card className="border-black/5 bg-white">
                <CardContent className="space-y-2 p-6">
                  <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">Terjawab</p>
                  <p className="text-4xl font-semibold">{answered}</p>
                </CardContent>
              </Card>

              <Card className="border-emerald-900/10 bg-emerald-50 sm:col-span-3">
                <CardContent className="space-y-3 p-6">
                  <div className="flex items-center gap-3">
                    <ChartNoAxesColumn className="size-5 text-emerald-700" />
                    <p className="font-medium text-emerald-950">Interpretasi singkat</p>
                  </div>
                  <p className="text-sm leading-6 text-emerald-950/80">
                    Hasil ini cocok dijadikan halaman penutup yang ringan. Kalau nanti backend menambah riwayat
                    attempt, kartu ini bisa berkembang menjadi ringkasan progres belajar.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-black/5 bg-[#fffdf7]">
              <CardContent className="space-y-6 p-6">
                <div className="space-y-2">
                  <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">Kenapa desain ini cocok</p>
                  <h2 className="text-2xl font-semibold">Sederhana, final, dan nyambung ke kontrak API</h2>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <div className="flex items-center gap-3">
                      <BookOpenText className="size-4 text-zinc-700" />
                      <p className="font-medium">Artikel tetap jadi pusat pengalaman</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      User merasa menyelesaikan satu sesi belajar, bukan sekadar mengirim formulir skor.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <p className="font-medium">One take terasa jelas</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      Karena backend mencegah submit ulang, status akhir dibuat tegas dengan CTA menuju bacaan lain.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <p className="font-medium">Mudah dihubungkan ke backend asli</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      Nantinya angka score dan accuracy tinggal diganti dari response submit atau state frontend.
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
    </main>
  );
}
