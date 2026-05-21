import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ articleId: string }>;
};

export default async function ArticleForumAliasPage({ params }: Props) {
  const { articleId } = await params;
  redirect(`/forums/${encodeURIComponent(articleId)}`);
}
