"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Search, Shield, UsersRound } from "lucide-react";
import { toast } from "sonner";

import ClanHomeCard from "@/src/features/league/components/ClanHomeCard";
import CreateClanForm from "@/src/features/league/components/CreateClanForm";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { YomuShell } from "@/src/components/yomu/YomuShell";
import { getCurrentUserId, getStoredAuthToken } from "@/src/lib/api/auth";
import { getUserTier, joinClan } from "@/src/lib/api/clan";
import type { UserTierInfo } from "@/src/types/clan";

export default function ClansPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [clanInfo, setClanInfo] = useState<UserTierInfo | null>(null);
  const [joinClanId, setJoinClanId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const token = getStoredAuthToken();
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    const uid = await getCurrentUserId();
    if (!uid) {
      router.replace("/auth/login");
      return;
    }
    setUserId(uid);

    const res = await getUserTier(uid);
    if (res.success && "data" in res && res.data) {
      setClanInfo(res.data);
    } else if (!res.success) {
      if (res.message?.toLowerCase().includes("not found") || res.message?.toLowerCase().includes("belum")) {
        setClanInfo({
          user_id: uid,
          clan_id: null,
          clan_name: null,
          tier: null,
        });
      } else {
        setError(res.message || "Gagal memuat data clan");
        toast.error(res.message || "Gagal memuat data clan");
      }
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const handleJoin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userId || !joinClanId.trim()) {
      return;
    }

    setJoining(true);
    const response = await joinClan({
      clan_id: joinClanId.trim(),
      user_id: userId,
    });
    setJoining(false);

    if (!response.success) {
      toast.error(response.message || "Gagal bergabung dengan clan");
      return;
    }

    toast.success("Berhasil bergabung dengan clan");
    setJoinClanId("");
    await load();
  };

  return (
    <YomuShell mode="learner">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 md:px-8 lg:px-10">
        <section className="overflow-hidden rounded-[2rem] border border-black/5 bg-white/88 shadow-[0_28px_70px_-42px_rgba(30,64,175,0.28)]">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5 border-b border-zinc-200/70 bg-[linear-gradient(135deg,_rgba(224,231,255,0.94),_rgba(219,234,254,0.78))] px-6 py-7 lg:border-r lg:border-b-0 lg:px-8 lg:py-8">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-700 text-white">
                <Shield className="size-6" />
              </div>
              <div>
                <h1 className="text-4xl leading-tight font-semibold">Ruang Clan</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600">
                  Buat clan baru atau bergabung memakai kode clan dari temanmu.
                </p>
              </div>
            </div>

            <div className="grid gap-4 px-6 py-7 lg:px-8 lg:py-8">
              <Card className="border-black/5 bg-zinc-950 text-white shadow-none">
                <CardContent className="p-5">
                  <p className="text-xs tracking-[0.18em] text-zinc-400 uppercase">Status user</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {loading ? "Memuat..." : clanInfo?.clan_name ?? "Belum punya clan"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {clanInfo?.tier ? `Tier aktif: ${clanInfo.tier}` : "Tier akan muncul setelah user bergabung clan."}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-black/5 bg-white shadow-none">
                <CardContent className="flex items-start gap-3 p-5">
                  <UsersRound className="mt-1 size-5 text-indigo-700" />
                  <p className="text-sm leading-6 text-zinc-600">
                    Fitur hapus clan dan persetujuan anggota sedang disiapkan. Untuk sekarang, fokus pada membuat dan bergabung dengan clan.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {loading ? <ClansPageSkeleton /> : null}

        {error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-sm text-red-700">{error}</CardContent>
          </Card>
        ) : null}

        {!loading && clanInfo?.clan_id ? (
          <ClanHomeCard clanInfo={clanInfo} />
        ) : null}

        {!loading && !clanInfo?.clan_id ? (
          <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
            {userId ? <CreateClanForm userId={userId} onSuccess={load} /> : null}

            <Card className="border-black/5 bg-white/88">
              <CardContent className="space-y-5 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
                    <Search className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Gabung clan dengan ID</h2>
                    <p className="text-sm text-zinc-500">Masukkan kode clan yang dibagikan oleh leader atau anggota lain.</p>
                  </div>
                </div>
                <form className="space-y-3" onSubmit={handleJoin}>
                  <div className="space-y-2">
                    <Label htmlFor="join-clan-id">Kode clan</Label>
                    <Input
                      id="join-clan-id"
                      value={joinClanId}
                      onChange={(event) => setJoinClanId(event.target.value)}
                      placeholder="Masukkan kode clan"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full rounded-full bg-zinc-950 text-white hover:bg-zinc-800" disabled={joining || !userId}>
                    {joining ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
                    {joining ? "Bergabung..." : "Gabung clan"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </YomuShell>
  );
}

function ClansPageSkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
      <div className="h-72 animate-pulse rounded-[1.5rem] bg-white/70" />
      <div className="h-72 animate-pulse rounded-[1.5rem] bg-white/70" />
    </div>
  );
}
