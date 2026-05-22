import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ articleId: string }>;
};

export default async function ArticleQuizAliasPage({ params }: Props) {
  const { articleId } = await params;
  redirect(`/bacaankuis/${encodeURIComponent(articleId)}`);
}
