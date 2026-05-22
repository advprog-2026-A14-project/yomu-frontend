import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ clanId: string }>;
};

export default async function ClanDetailAliasPage({ params }: Props) {
  const { clanId } = await params;
  redirect(`/clans/${encodeURIComponent(clanId)}`);
}
