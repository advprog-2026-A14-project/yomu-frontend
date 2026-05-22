import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ articleId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ArticleQuizResultAliasPage({ params, searchParams }: Props) {
  const { articleId } = await params;
  const query = await searchParams;
  const nextParams = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      value.forEach((item) => nextParams.append(key, item));
    } else if (value) {
      nextParams.set(key, value);
    }
  }

  const suffix = nextParams.size > 0 ? `?${nextParams.toString()}` : "";
  redirect(`/bacaankuis/${encodeURIComponent(articleId)}/hasil${suffix}`);
}
