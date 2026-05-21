"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Medal, RefreshCw, Trophy } from "lucide-react";

import { getLeaderboard, type Leaderboard } from "@/src/lib/api/league";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";

const tiers = ["Bronze", "Silver", "Gold", "Diamond"];

export default function LeaderboardPage() {
  const [tier, setTier] = useState("Bronze");
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
  const [message, setMessage] = useState("Memuat leaderboard dari Rust Engine...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadLeaderboard = async () => {
      setLoading(true);
      setMessage("Memuat leaderboard dari Rust Engine...");
      const response = await getLeaderboard(tier);

      if (!active) {
        return;
      }

      setLoading(false);

      if (response.success && "data" in response && response.data) {
        setLeaderboard(response.data);
        setMessage("Leaderboard aktif dari Rust Engine.");
        return;
      }

      setLeaderboard(null);
      setMessage(response.message);
    };

    void loadLeaderboard();

    return () => {
      active = false;
    };
  }, [tier]);

  const topEntry = useMemo(() => leaderboard?.entries[0] ?? null, [leaderboard]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f4efe3_0%,_#f7f7f4_38%,_#eef4ef_100%)] px-5 py-8 text-zinc-950 md:px-8 lg:px-10">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white/82 shadow-[0_28px_70px_-42px_rgba(59,86,64,0.35)]">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-5 border-b border-zinc-200/70 bg-[linear-gradient(135deg,_rgba(255,238,190,0.92),_rgba(231,246,239,0.84))] px-6 py-7 lg:border-r lg:border-b-0 lg:px-8 lg:py-8">
              <Link href="/app" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900">
                <ArrowLeft className="size-4" />
                Kembali ke dashboard
              </Link>
              <Badge className="w-fit bg-amber-700 px-3 py-1 text-white">Liga Clan</Badge>
              <div>
                <h1 className="text-4xl font-semibold leading-tight">Leaderboard Clan</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600">{message}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {tiers.map((item) => (
                  <Button
                    key={item}
                    type="button"
                    variant={item === tier ? "default" : "outline"}
                    className="h-auto min-h-9 rounded-full px-4 py-2"
                    onClick={() => setTier(item)}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-zinc-950 px-6 py-7 text-white lg:px-8 lg:py-8">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-amber-400/15 p-3 text-amber-200">
                  <Trophy className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Puncak tier {tier}</p>
                  <p className="text-sm text-zinc-400">
                    {topEntry ? topEntry.clan_name : "Belum ada clan pada tier ini."}
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-4">
                  <p className="text-xs tracking-[0.18em] text-zinc-400 uppercase">Clan</p>
                  <p className="mt-2 text-3xl font-semibold">{leaderboard?.entries.length ?? 0}</p>
                </div>
                <div className="rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-4">
                  <p className="text-xs tracking-[0.18em] text-zinc-400 uppercase">Skor top</p>
                  <p className="mt-2 text-3xl font-semibold">{topEntry?.total_score ?? 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          {loading ? (
            <Card className="border-black/5 bg-white/86">
              <CardContent className="flex items-center gap-3 p-5 text-sm text-zinc-600">
                <RefreshCw className="size-4 animate-spin" />
                Memuat data...
              </CardContent>
            </Card>
          ) : null}

          {!loading && leaderboard?.entries.length ? (
            leaderboard.entries.map((entry) => (
              <Card key={entry.clan_id} className="border-black/5 bg-white/86">
                <CardContent className="grid min-w-0 gap-4 p-5 md:grid-cols-[4rem_minmax(0,1fr)_auto] md:items-center">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-lg font-semibold text-amber-800">
                    #{entry.rank}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold leading-tight">{entry.clan_name}</h2>
                    <p className="mt-1 text-sm text-zinc-500">ID: {entry.clan_id}</p>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-zinc-50 px-4 py-3">
                    <Medal className="size-4 text-amber-700" />
                    <div>
                      <p className="text-xs text-zinc-500">{entry.tier}</p>
                      <p className="font-semibold">{entry.total_score} pts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : null}

          {!loading && !leaderboard?.entries.length ? (
            <Card className="border-black/5 bg-white/86">
              <CardContent className="p-6 text-sm leading-6 text-zinc-600">
                Belum ada data leaderboard yang bisa ditampilkan. Pastikan Rust Engine aktif,
                JWT secret sama dengan Java, dan `NEXT_PUBLIC_RUST_ENGINE_BASE_URL` sudah benar.
              </CardContent>
            </Card>
          ) : null}
        </div>
      </section>
    </main>
  );
}
