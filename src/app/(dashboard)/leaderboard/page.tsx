"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getLeaderboard, type Leaderboard } from "@/src/lib/api/league";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";

const tiers = ["Bronze", "Silver", "Gold", "Diamond"];

export default function LeaderboardPage() {
  const [tier, setTier] = useState("Bronze");
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
  const [message, setMessage] = useState("Memuat leaderboard dari Rust Engine...");

  useEffect(() => {
    let active = true;

    const loadLeaderboard = async () => {
      setMessage("Memuat leaderboard dari Rust Engine...");
      const response = await getLeaderboard(tier);

      if (!active) {
        return;
      }

      if (response.success && "data" in response && response.data) {
        setLeaderboard(response.data);
        setMessage("Leaderboard aktif dari Rust Engine.");
        return;
      }

      setLeaderboard(null);
      setMessage(response.message);
    };

    loadLeaderboard();

    return () => {
      active = false;
    };
  }, [tier]);

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-6 text-zinc-950 sm:px-5 md:px-8">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <Link href="/app" className="text-sm text-zinc-500 hover:text-zinc-900">
              Kembali ke hub
            </Link>
            <h1 className="mt-3 text-3xl font-semibold leading-tight">Leaderboard Clan</h1>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{message}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {tiers.map((item) => (
              <Button
                key={item}
                type="button"
                variant={item === tier ? "default" : "outline"}
                className="h-auto min-h-9 whitespace-normal px-4 py-2 text-center"
                onClick={() => setTier(item)}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          {leaderboard?.entries.length ? (
            leaderboard.entries.map((entry) => (
              <Card key={entry.clan_id} className="border-zinc-200 bg-white">
                <CardContent className="grid min-w-0 gap-3 p-5 md:grid-cols-[4rem_minmax(0,1fr)_auto] md:items-center">
                  <div className="text-2xl font-semibold">#{entry.rank}</div>
                  <div className="min-w-0">
                    <h2 className="font-semibold leading-tight">{entry.clan_name}</h2>
                    <p className="text-sm text-zinc-500">{entry.tier}</p>
                  </div>
                  <div className="text-lg font-semibold">{entry.total_score} pts</div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-zinc-200 bg-white">
              <CardContent className="p-5 text-sm leading-6 text-zinc-600">
                Belum ada data leaderboard yang bisa ditampilkan. Pastikan Rust Engine aktif, JWT secret sama
                dengan Java, dan `RUST_ENGINE_BASE_URL` sudah benar.
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </main>
  );
}
