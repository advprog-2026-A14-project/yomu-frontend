import { CommentList } from "@/src/components/forum/CommentList";
import { YomuShell } from "@/src/components/yomu/YomuShell";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = {
  params: Promise<{ articleId: string }>;
};

export default async function ForumPage({ params }: Props) {
  const { articleId } = await params;

  return (
    <YomuShell mode="learner">
      <section className="mx-auto w-full max-w-7xl space-y-6 px-5 py-8 md:px-8 lg:px-10">
        <div className="flex items-center gap-3">
          <Link
            href={`/bacaankuis/${articleId}`}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600 hover:text-zinc-900"
          >
            <ArrowLeft className="size-4" />
            Kembali ke artikel
          </Link>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white/88 p-6 shadow-[0_28px_70px_-46px_rgba(30,64,175,0.28)] md:p-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-semibold">Diskusi Artikel</h1>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Bagikan pendapat, beri reaksi, dan lanjutkan pembacaan secara kontekstual.
            </p>
          </div>
        </div>

        <CommentList articleId={articleId} />
      </section>
    </YomuShell>
  );
}
