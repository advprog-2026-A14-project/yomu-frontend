"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, RefreshCw, Target } from "lucide-react";

import { LearnerGuard } from "@/src/components/yomu/LearnerGuard";
import { YomuShell } from "@/src/components/yomu/YomuShell";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  claimMission,
  getDailyMissions,
  type DailyMissionItem,
} from "@/src/lib/api/gamification";

const MISSION_TYPE_LABEL: Record<string, string> = {
  ReadArticle: "Baca artikel",
  Quiz: "Selesaikan kuis",
  DailyLogin: "Login harian",
};

function MissionsContent() {
  const [missions, setMissions] = useState<DailyMissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const loadMissions = useCallback(async () => {
    setLoading(true);
    setError(null);

    const res = await getDailyMissions();
    setLoading(false);

    if (!res.success || !("data" in res) || !res.data) {
      setError(res.message);
      return;
    }

    setMissions(res.data.missions);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadMissions();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadMissions]);

  const handleClaim = async (mission: DailyMissionItem) => {
    setClaimingId(mission.mission_id);
    setActionMessage(null);

    const res = await claimMission(mission.mission_id);
    setClaimingId(null);
    setActionMessage(res.message);

    if (res.success) {
      await loadMissions();
    }
  };

  const completedCount = missions.filter((m) => m.is_claimed).length;
  const totalPoints = missions
    .filter((m) => m.is_claimed)
    .reduce((sum, m) => sum + m.reward_points, 0);

  return (
    <YomuShell mode="learner">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-5 py-8 md:px-8 lg:px-10">
        <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white/82 shadow-[0_28px_70px_-42px_rgba(59,86,64,0.35)]">
          <div className="space-y-5 border-b border-zinc-200/70 bg-[linear-gradient(135deg,_rgba(209,250,229,0.85),_rgba(254,252,232,0.7))] px-6 py-7 lg:px-8">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900"
            >
              <ArrowLeft className="size-4" />
              Kembali ke dashboard
            </Link>
            <div className="flex items-center gap-3">
              <Target className="size-7 text-emerald-700" />
              <h1 className="text-3xl font-semibold">Misi Harian</h1>
            </div>
            <p className="text-sm text-zinc-600">
              Selesaikan misi untuk mendapatkan poin dan membangun kebiasaan membaca.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full"
                disabled={loading}
                onClick={() => void loadMissions()}
              >
                <RefreshCw className={`mr-2 size-4 ${loading ? "animate-spin" : ""}`} />
                Muat ulang
              </Button>
              {!loading && missions.length > 0 ? (
                <>
                  <div className="rounded-full bg-white/70 px-4 py-2 text-sm text-zinc-700">
                    {completedCount}/{missions.length} selesai
                  </div>
                  <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
                    +{totalPoints} poin diklaim
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {actionMessage ? (
          <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {actionMessage}
          </p>
        ) : null}

        {error ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        ) : null}

        {loading ? (
          <Card className="border-black/5 bg-white/86">
            <CardContent className="flex items-center gap-3 p-6 text-sm text-zinc-500">
              <RefreshCw className="size-4 animate-spin" />
              Memuat misi hari ini...
            </CardContent>
          </Card>
        ) : null}

        {!loading && missions.length === 0 && !error ? (
          <Card className="border-black/5 bg-white/86">
            <CardContent className="p-6 text-sm leading-6 text-zinc-500">
              Belum ada misi aktif hari ini. Coba kembali besok atau hubungi admin untuk menyiapkan
              misi.
            </CardContent>
          </Card>
        ) : null}

        {!loading
          ? missions.map((mission) => {
              const canClaim =
                !mission.is_claimed && mission.current_progress >= mission.target_count;
              const progressPct = Math.min(
                100,
                (mission.current_progress / Math.max(mission.target_count, 1)) * 100,
              );

              return (
                <Card key={mission.mission_id} className="border-black/5 bg-white/86">
                  <CardContent className="space-y-5 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="truncate font-semibold leading-tight">{mission.description}</h2>
                        <p className="mt-1 text-sm text-zinc-500">
                          {MISSION_TYPE_LABEL[mission.mission_type] ?? mission.mission_type}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-lg font-bold text-emerald-700">
                          +{mission.reward_points}
                        </p>
                        <p className="text-xs text-zinc-400">poin</p>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex justify-between text-xs text-zinc-500">
                        <span>
                          Progress: {mission.current_progress}/{mission.target_count}
                        </span>
                        <span>{Math.round(progressPct)}%</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-zinc-100">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {mission.is_claimed ? (
                        <div className="flex items-center gap-2 text-sm text-emerald-700">
                          <CheckCircle2 className="size-4" />
                          Reward sudah diklaim
                        </div>
                      ) : canClaim ? (
                        <Button
                          type="button"
                          className="rounded-xl bg-emerald-700 text-white hover:bg-emerald-800"
                          disabled={claimingId === mission.mission_id}
                          onClick={() => void handleClaim(mission)}
                        >
                          {claimingId === mission.mission_id ? "Mengklaim..." : "Klaim reward"}
                        </Button>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          Belum selesai
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          : null}
      </section>
    </YomuShell>
  );
}

export default function MissionsPage() {
  return <LearnerGuard>{() => <MissionsContent />}</LearnerGuard>;
}
