import { CommentList } from "@/src/components/forum/CommentList";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = {
  params: Promise<{ articleId: string }>;
};

export default async function ForumPage({ params }: Props) {
  const { articleId } = await params;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={`/bacaankuis/${articleId}`}
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900"
        >
          <ArrowLeft className="size-4" />
          Kembali ke artikel
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Diskusi Artikel</h1>
        <p className="text-sm text-zinc-500">
          Bagikan pendapat dan diskusi seputar artikel ini.
        </p>
      </div>

      <CommentList articleId={articleId} />
    </main>
  );
}