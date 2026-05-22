"use client";

import { useState, useCallback } from "react";
import { Users, Trophy, Zap, RefreshCw, AlertCircle } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { getLeaderboard, triggerSeasonEnd, processBuffs } from "@/src/lib/api/clan";
import { toast } from "sonner";
import type { LeaderboardEntry } from "@/src/types/clan";

const TIER_COLORS: Record<string, string> = {
  Bronze: "bg-amber-700 text-white",
  Silver: "bg-slate-400 text-white",
  Gold: "bg-yellow-500 text-white",
  Diamond: "bg-cyan-500 text-white",
};

const TIERS = ["Bronze", "Silver", "Gold", "Diamond"];

function SeasonManagement() {
  const [seasonId, setSeasonId] = useState("");
  const [triggering, setTriggering] = useState(false);

  const onTrigger = async () => {
    if (!seasonId.trim()) {
      toast.error("Masukkan season ID");
      return;
    }
    setTriggering(true);
    try {
      const res = await triggerSeasonEnd(seasonId.trim());
      if (res.success) {
        toast.success("Season ended successfully");
        setSeasonId("");
      } else {
        toast.error(res.message || "Failed to trigger season end");
      }
    } finally {
      setTriggering(false);
    }
  };

  return (
    <Card className="overflow-hidden border-black/5 bg-white/88 shadow-[0_28px_70px_-42px_rgba(59,86,64,0.42)]">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="h-5 w-5" />
          Kelola Liga — Akhiri Season
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <p className="text-sm text-muted-foreground">
          Meng-trigger pergantian season akan memproses promosi dan degradasi Clan secara otomatis
          berdasarkan klasemen akhir.
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Season UUID (cth: 123e4567-e89b-...)"
            value={seasonId}
            onChange={(e) => setSeasonId(e.target.value)}
            className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
          <Button
            onClick={onTrigger}
            disabled={triggering}
            className="rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {triggering ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Akhiri Season"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ClanLeaderboardCard({ tier }: { tier: string }) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [processingClan, setProcessingClan] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await getLeaderboard(tier);
    setLoading(false);
    if (res.success && "data" in res && res.data) {
      setEntries(res.data.entries.filter((e: LeaderboardEntry) => e.tier === tier));
    } else {
      setError(res.message || "Failed to load leaderboard");
    }
  }, [tier]);

  if (!expanded && entries.length === 0 && !loading) {
    return (
      <Button
        variant="outline"
        className="w-full justify-start rounded-xl"
        onClick={() => {
          setExpanded(true);
          load();
        }}
      >
        <Trophy className="mr-2 h-4 w-4" />
        Lihat Leaderboard {tier}
      </Button>
    );
  }

  const onProcessBuffs = async (clanId: string) => {
    setProcessingClan(clanId);
    try {
      const res = await processBuffs(clanId);
      if (res.success) {
        toast.success(`Buffs processed for clan ${clanId.slice(0, 8)}...`);
      } else {
        toast.error(res.message || "Failed to process buffs");
      }
    } finally {
      setProcessingClan(null);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        className="w-full justify-start rounded-xl"
        onClick={() => {
          if (expanded) {
            setExpanded(false);
          } else {
            setExpanded(true);
            load();
          }
        }}
      >
        <Trophy className="mr-2 h-4 w-4" />
        {expanded ? "Sembunyikan" : "Tampilkan"} Leaderboard {tier}
        {entries.length > 0 && (
          <Badge className={`ml-2 ${TIER_COLORS[tier]}`}>{entries.length} clans</Badge>
        )}
      </Button>

      {expanded && (
        <div className="space-y-2">
          {loading ? (
            <p className="py-4 text-center text-sm text-muted-foreground">Memuat...</p>
          ) : error ? (
            <p className="py-4 text-center text-sm text-red-500">{error}</p>
          ) : entries.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">Belum ada clan di tier ini</p>
          ) : (
            entries.map((entry) => (
              <Card key={entry.clan_id} className="border-black/5 bg-white/60">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold text-zinc-400">#{entry.rank}</div>
                    <div>
                      <p className="font-semibold text-zinc-950">{entry.clan_name}</p>
                      <p className="text-xs text-muted-foreground">
                        ID: {entry.clan_id.slice(0, 8)}... • Score: {entry.total_score}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full text-xs"
                    disabled={processingClan === entry.clan_id}
                    onClick={() => onProcessBuffs(entry.clan_id)}
                  >
                    {processingClan === entry.clan_id ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      "Process Buffs"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function ClanLeaderboardSection() {
  return (
    <Card className="overflow-hidden border-black/5 bg-white/88 shadow-[0_28px_70px_-42px_rgba(59,86,64,0.42)]">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5" />
          Kelola Clan — Leaderboard & Buffs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <p className="text-sm text-muted-foreground">
          Proses buffs secara manual untuk setiap clan. Lihat leaderboard per tier dan trigger
          buff/debuff computation.
        </p>
        <div className="space-y-3">
          {TIERS.map((tier) => (
            <ClanLeaderboardCard key={tier} tier={tier} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SyncUsersNotice() {
  return (
    <Card className="overflow-hidden border-amber-200 bg-amber-50/70 shadow-none">
      <CardContent className="flex items-start gap-3 py-4">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-amber-800">Clan creation blocked — user not synced</p>
          <p className="text-xs text-amber-700">
            User yang membuat clan harus sudah ada di tabel <code>engine_users</code> di Rust DB.
            Pastikan Java outbox sync sudah berjalan atau sync manual via endpoint internal.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminClanSection() {
  return (
    <div className="space-y-6">
      <SyncUsersNotice />
      <SeasonManagement />
      <ClanLeaderboardSection />
    </div>
  );
}