"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Trophy } from "lucide-react";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { getLeaderboard, type LeaderboardEntry } from "@/src/lib/api/league";

const tiers = ["Bronze", "Silver", "Gold", "Diamond"];

export default function LeaderboardPage() {
  const [tier, setTier] = useState("Bronze");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      const response = await getLeaderboard(tier);

      if (!active) {
        return;
      }

      setLoading(false);

      if (!response.success || !("data" in response) || !response.data) {
        setError(response.message);
        setEntries([]);
        return;
      }

      setEntries(response.data.entries);
    };

    load();

    return () => {
      active = false;
    };
  }, [tier]);

  return (
    <main className="min-h-screen bg-[#f7f8f4] px-5 py-6 text-zinc-950 md:px-8">
      <section className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-black/5 bg-white p-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <Button asChild variant="ghost" className="w-fit rounded-full px-0 text-zinc-500 hover:bg-transparent">
              <Link href="/app">
                <ArrowLeft className="size-4" />
                Dashboard
              </Link>
            </Button>
            <div>
              <Badge className="bg-zinc-950 text-white">Rust Engine</Badge>
              <h1 className="mt-3 text-3xl font-semibold md:text-4xl">Leaderboard Clan</h1>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Data diambil dari `/api/v1/leaderboards` dengan token user aktif.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {tiers.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTier(item)}
                className={`rounded-full border px-4 py-2 text-sm ${
                  tier === item
                    ? "border-zinc-950 bg-zinc-950 text-white"
                    : "border-zinc-200 bg-white text-zinc-600"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>
        ) : null}

        <Card className="border-black/5 bg-white">
          <CardContent className="p-0">
            {loading ? (
              <p className="p-6 text-sm text-zinc-500">Memuat leaderboard...</p>
            ) : entries.length === 0 ? (
              <p className="p-6 text-sm text-zinc-500">Belum ada clan pada tier {tier}.</p>
            ) : (
              <div className="divide-y divide-zinc-100">
                {entries.map((entry) => (
                  <div key={entry.clan_id} className="grid gap-4 p-5 md:grid-cols-[5rem_1fr_9rem_7rem] md:items-center">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-zinc-950 text-lg font-semibold text-white">
                      {entry.rank}
                    </div>
                    <div>
                      <p className="font-semibold">{entry.clan_name}</p>
                      <p className="mt-1 text-sm text-zinc-500">{entry.clan_id}</p>
                    </div>
                    <div className="text-sm text-zinc-500">
                      <span className="font-semibold text-zinc-950">{entry.total_score}</span> score
                    </div>
                    <div className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700">
                      <Trophy className="size-4" />
                      {entry.tier}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
