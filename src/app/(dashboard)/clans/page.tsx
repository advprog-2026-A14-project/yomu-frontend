"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Crown, Search, Shield, UsersRound } from "lucide-react";

import { me, type User } from "@/src/lib/api/auth";
import { createClan, getClan, getUserTier, joinClan, type Clan } from "@/src/lib/api/league";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

type TierInfo = {
  user_id: string;
  clan_id: string | null;
  clan_name: string | null;
  tier: string | null;
};

export default function ClansPage() {
  const [user, setUser] = useState<User | null>(null);
  const [tierInfo, setTierInfo] = useState<TierInfo | null>(null);
  const [clan, setClan] = useState<Clan | null>(null);
  const [name, setName] = useState("");
  const [joinClanId, setJoinClanId] = useState("");
  const [lookupClanId, setLookupClanId] = useState("");
  const [message, setMessage] = useState("Memuat session...");
  const [submitting, setSubmitting] = useState<string | null>(null);

  const refreshTier = async (currentUser: User) => {
    const tierResponse = await getUserTier(currentUser.user_id);

    if (tierResponse.success && "data" in tierResponse && tierResponse.data) {
      setTierInfo(tierResponse.data);
      setMessage("Data tier aktif dari Rust Engine.");

      if (tierResponse.data.clan_id) {
        const clanResponse = await getClan(tierResponse.data.clan_id);

        if (clanResponse.success && "data" in clanResponse && clanResponse.data) {
          setClan(clanResponse.data);
        }
      }

      return;
    }

    setMessage(tierResponse.message);
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      const session = await me();

      if (!active) {
        return;
      }

      if (!session.response.success || !("data" in session.response) || !session.response.data) {
        setMessage(session.response.message);
        return;
      }

      setUser(session.response.data);
      await refreshTier(session.response.data);
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  const onCreateClan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user || !name.trim()) {
      return;
    }

    setSubmitting("create");
    const response = await createClan(name.trim(), user.user_id);
    setSubmitting(null);

    if (!response.success) {
      setMessage(response.message);
      return;
    }

    setMessage("Clan berhasil dibuat.");
    setName("");
    await refreshTier(user);
  };

  const onJoinClan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user || !joinClanId.trim()) {
      return;
    }

    setSubmitting("join");
    const response = await joinClan(joinClanId.trim(), user.user_id);
    setSubmitting(null);

    if (!response.success) {
      setMessage(response.message);
      return;
    }

    setMessage("Berhasil bergabung ke clan.");
    setJoinClanId("");
    await refreshTier(user);
  };

  const onLookupClan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!lookupClanId.trim()) {
      return;
    }

    setSubmitting("lookup");
    const response = await getClan(lookupClanId.trim());
    setSubmitting(null);

    if (!response.success || !("data" in response) || !response.data) {
      setMessage(response.message);
      return;
    }

    setClan(response.data);
    setMessage("Detail clan berhasil dimuat dari Rust Engine.");
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f4efe3_0%,_#f7f7f4_38%,_#eef4ef_100%)] px-5 py-8 text-zinc-950 md:px-8 lg:px-10">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white/82 shadow-[0_28px_70px_-42px_rgba(59,86,64,0.35)]">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5 border-b border-zinc-200/70 bg-[linear-gradient(135deg,_rgba(222,241,255,0.94),_rgba(231,246,239,0.84))] px-6 py-7 lg:border-r lg:border-b-0 lg:px-8 lg:py-8">
              <Link href="/app" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900">
                <ArrowLeft className="size-4" />
                Kembali ke dashboard
              </Link>
              <Badge className="w-fit bg-sky-700 px-3 py-1 text-white">Clan & Tier</Badge>
              <div>
                <h1 className="text-4xl font-semibold leading-tight">Ruang Clan</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600">{message}</p>
              </div>
            </div>

            <div className="grid gap-4 px-6 py-7 lg:px-8 lg:py-8">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.5rem] bg-zinc-950 px-4 py-4 text-white">
                  <p className="text-xs tracking-[0.18em] text-zinc-400 uppercase">User</p>
                  <p className="mt-2 font-semibold">{user?.display_name ?? "-"}</p>
                </div>
                <div className="rounded-[1.5rem] bg-white px-4 py-4">
                  <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">Clan</p>
                  <p className="mt-2 font-semibold">{tierInfo?.clan_name ?? "Belum ada"}</p>
                </div>
                <div className="rounded-[1.5rem] bg-white px-4 py-4">
                  <p className="text-xs tracking-[0.18em] text-zinc-500 uppercase">Tier</p>
                  <p className="mt-2 font-semibold">{tierInfo?.tier ?? "-"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-5">
            <Card className="border-black/5 bg-white/86">
              <CardContent className="space-y-5 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                    <Crown className="size-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold">Buat Clan</h2>
                    <p className="text-sm text-zinc-500">Pembuat clan menjadi leader.</p>
                  </div>
                </div>
                <form className="space-y-3" onSubmit={onCreateClan}>
                  <Label htmlFor="clan-name">Nama clan</Label>
                  <Input
                    id="clan-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    disabled={!user || submitting === "create"}
                    required
                  />
                  <Button type="submit" className="rounded-full" disabled={!user || submitting === "create"}>
                    {submitting === "create" ? "Membuat..." : "Buat Clan"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-black/5 bg-white/86">
              <CardContent className="space-y-5 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                    <UsersRound className="size-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold">Gabung Clan</h2>
                    <p className="text-sm text-zinc-500">Masukkan clan ID yang dibagikan leader.</p>
                  </div>
                </div>
                <form className="space-y-3" onSubmit={onJoinClan}>
                  <Label htmlFor="join-clan">Clan ID</Label>
                  <Input
                    id="join-clan"
                    value={joinClanId}
                    onChange={(event) => setJoinClanId(event.target.value)}
                    disabled={!user || submitting === "join"}
                    required
                  />
                  <Button type="submit" className="rounded-full" disabled={!user || submitting === "join"}>
                    {submitting === "join" ? "Bergabung..." : "Gabung Clan"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <Card className="border-black/5 bg-white/86">
            <CardContent className="space-y-5 p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-zinc-100 p-3 text-zinc-800">
                    <Shield className="size-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold">Detail Clan</h2>
                    <p className="text-sm text-zinc-500">Memakai `GET /api/v1/clans/:id` dari Rust.</p>
                  </div>
                </div>
                <form className="flex gap-2" onSubmit={onLookupClan}>
                  <Input
                    value={lookupClanId}
                    onChange={(event) => setLookupClanId(event.target.value)}
                    placeholder="Cari clan ID"
                  />
                  <Button type="submit" variant="outline" className="rounded-full" disabled={submitting === "lookup"}>
                    <Search className="size-4" />
                  </Button>
                </form>
              </div>

              {clan ? (
                <div className="space-y-4">
                  <div className="rounded-[1.5rem] bg-zinc-950 p-5 text-white">
                    <p className="text-xs tracking-[0.18em] text-zinc-400 uppercase">{clan.id}</p>
                    <h3 className="mt-2 text-2xl font-semibold">{clan.name}</h3>
                    <p className="mt-2 text-sm text-zinc-400">
                      {clan.tier} tier, {clan.total_score} total score
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(clan.members ?? []).map((member) => (
                      <div key={member.user_id} className="rounded-[1.25rem] border border-zinc-200 bg-white px-4 py-3">
                        <p className="font-medium">{member.role}</p>
                        <p className="mt-1 text-sm text-zinc-500">{member.user_id}</p>
                      </div>
                    ))}
                    {(clan.members ?? []).length === 0 ? (
                      <div className="rounded-[1.25rem] border border-dashed border-zinc-300 bg-zinc-50 px-4 py-5 text-sm text-zinc-500">
                        Backend belum mengirim daftar anggota untuk clan ini.
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-zinc-300 bg-zinc-50 px-5 py-8 text-sm text-zinc-500">
                  Detail clan akan tampil setelah user punya clan atau mencari clan berdasarkan ID.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
