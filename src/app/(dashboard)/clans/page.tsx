"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Shield, UsersRound } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { logout, me, type User } from "@/src/lib/api/auth";
import { createClan, getClan, getUserTier, joinClan, type Clan, type UserTier } from "@/src/lib/api/league";

export default function ClansPage() {
  const [user, setUser] = useState<User | null>(null);
  const [tier, setTier] = useState<UserTier | null>(null);
  const [clan, setClan] = useState<Clan | null>(null);
  const [clanName, setClanName] = useState("");
  const [joinClanId, setJoinClanId] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const session = await me();

    if (!session.response.success || !("data" in session.response) || !session.response.data) {
      setError(session.response.message);
      setLoading(false);
      return;
    }

    setUser(session.response.data);
    const tierResponse = await getUserTier(session.response.data.user_id);

    if (tierResponse.success && "data" in tierResponse && tierResponse.data) {
      setTier(tierResponse.data);

      if (tierResponse.data.clan_id) {
        const clanResponse = await getClan(tierResponse.data.clan_id);
        if (clanResponse.success && "data" in clanResponse && clanResponse.data) {
          setClan(clanResponse.data);
        }
      } else {
        setClan(null);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const onCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !clanName.trim()) {
      return;
    }

    setError(null);
    setStatus(null);
    const response = await createClan(clanName.trim(), user.user_id);

    if (!response.success) {
      setError(response.message);
      return;
    }

    setClanName("");
    setStatus("Clan berhasil dibuat.");
    await load();
  };

  const onJoin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !joinClanId.trim()) {
      return;
    }

    setError(null);
    setStatus(null);
    const response = await joinClan(joinClanId.trim(), user.user_id);

    if (!response.success) {
      setError(response.message);
      return;
    }

    setJoinClanId("");
    setStatus("Berhasil join clan.");
    await load();
  };

  if (loading) {
    return <main className="min-h-screen bg-[#f7f8f4] p-6 text-sm text-zinc-500">Memuat clan...</main>;
  }

  return (
    <main className="min-h-screen bg-[#f7f8f4] px-5 py-6 text-zinc-950 md:px-8">
      <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <Card className="border-black/5 bg-white">
            <CardContent className="space-y-5 p-6">
              <Button asChild variant="ghost" className="w-fit rounded-full px-0 text-zinc-500 hover:bg-transparent">
                <Link href="/app">
                  <ArrowLeft className="size-4" />
                  Dashboard
                </Link>
              </Button>
              <div>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-zinc-950 text-white">
                  <UsersRound className="size-5" />
                </div>
                <h1 className="mt-4 text-3xl font-semibold">Clan</h1>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Create dan join clan diteruskan ke Rust Engine dengan JWT dari cookie login.
                </p>
              </div>
              <Button type="button" variant="outline" className="rounded-full" onClick={logout}>
                Logout
              </Button>
            </CardContent>
          </Card>

          <Card className="border-black/5 bg-zinc-950 text-white">
            <CardContent className="space-y-3 p-6">
              <p className="text-xs tracking-[0.18em] text-zinc-400 uppercase">User aktif</p>
              <p className="text-2xl font-semibold">{user?.display_name ?? "-"}</p>
              <p className="text-sm leading-6 text-zinc-400">
                {tier?.clan_name ? `${tier.clan_name} - ${tier.tier ?? "Tanpa tier"}` : "Belum punya clan"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
          {status ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{status}</div> : null}

          {clan ? (
            <Card className="border-black/5 bg-white">
              <CardContent className="space-y-5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-zinc-500">Clan saat ini</p>
                    <h2 className="mt-1 text-2xl font-semibold">{clan.name}</h2>
                  </div>
                  <div className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700">{clan.tier}</div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-zinc-50 p-4">
                    <p className="text-sm text-zinc-500">Total score</p>
                    <p className="mt-1 text-2xl font-semibold">{clan.total_score}</p>
                  </div>
                  <div className="rounded-2xl bg-zinc-50 p-4">
                    <p className="text-sm text-zinc-500">Members</p>
                    <p className="mt-1 text-2xl font-semibold">{clan.members?.length ?? 1}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {(clan.members ?? []).map((member) => (
                    <div key={member.user_id} className="flex items-center justify-between rounded-2xl border border-zinc-100 p-3 text-sm">
                      <span>{member.user_id}</span>
                      <span className="text-zinc-500">{member.role}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-black/5 bg-white">
                <CardContent className="space-y-4 p-6">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <Shield className="size-5" />
                  </div>
                  <h2 className="text-xl font-semibold">Buat clan</h2>
                  <form className="space-y-3" onSubmit={onCreate}>
                    <Input value={clanName} onChange={(event) => setClanName(event.target.value)} placeholder="Nama clan" required />
                    <Button className="w-full rounded-full bg-zinc-950 text-white hover:bg-zinc-800">Buat</Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-black/5 bg-white">
                <CardContent className="space-y-4 p-6">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                    <UsersRound className="size-5" />
                  </div>
                  <h2 className="text-xl font-semibold">Join clan</h2>
                  <form className="space-y-3" onSubmit={onJoin}>
                    <Input value={joinClanId} onChange={(event) => setJoinClanId(event.target.value)} placeholder="UUID clan" required />
                    <Button className="w-full rounded-full bg-zinc-950 text-white hover:bg-zinc-800">Join</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
