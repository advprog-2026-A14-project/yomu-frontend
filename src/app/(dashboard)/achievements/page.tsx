"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  RefreshCw,
  Target,
} from "lucide-react";

import type { User } from "@/src/lib/api/auth";
import {
  claimMission,
  getDailyMissions,
  getUserAchievements,
  toggleAchievementVisibility,
  type DailyMissionItem,
  type UserAchievementItem,
} from "@/src/lib/api/gamification";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Switch } from "@/src/components/ui/switch";
import { LearnerGuard } from "@/src/components/yomu/LearnerGuard";
import { YomuShell } from "@/src/components/yomu/YomuShell";

function AchievementsContent({ user }: { user: User }) {
  const [missions, setMissions] = useState<DailyMissionItem[]>([]);
  const [achievements, setAchievements] = useState<UserAchievementItem[]>([]);
  const [message, setMessage] = useState("Memuat misi dan pencapaian...");
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setMessage("Memuat misi dan pencapaian...");

    const [missionsRes, achievementsRes] = await Promise.all([
      getDailyMissions(),
      getUserAchievements(user.user_id),
    ]);

    setLoading(false);

    if (!missionsRes.success || !("data" in missionsRes) || !missionsRes.data) {
      setMissions([]);
      setMessage(missionsRes.message);
      return;
    }

    if (!achievementsRes.success || !("data" in achievementsRes) || !achievementsRes.data) {
      setAchievements([]);
      setMessage(achievementsRes.message);
      return;
    }

    setMissions(missionsRes.data.missions);
    setAchievements(achievementsRes.data.achievements);
    setMessage("Data gamifikasi siap ditampilkan.");
  }, [user.user_id]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleClaim = async (mission: DailyMissionItem) => {
    setClaimingId(mission.mission_id);
    setActionMessage(null);

    const res = await claimMission(mission.mission_id);
    setClaimingId(null);

    if (res.success) {
      setActionMessage(res.message);
      await loadData();
      return;
    }

    setActionMessage(res.message);
  };

  const handleToggleProfile = async (achievement: UserAchievementItem, checked: boolean) => {
    setTogglingId(achievement.achievement_id);
    setActionMessage(null);

    const res = await toggleAchievementVisibility(
      user.user_id,
      achievement.achievement_id,
      checked,
    );

    setTogglingId(null);

    if (res.success && "data" in res && res.data) {
      setAchievements((prev) =>
        prev.map((item) =>
          item.achievement_id === achievement.achievement_id
            ? { ...item, is_shown_on_profile: res.data!.is_shown_on_profile }
            : item,
        ),
      );
      setActionMessage(res.message);
      return;
    }

    setActionMessage(res.message);
  };

  const completedCount = achievements.filter((a) => a.is_completed).length;
  const claimableCount = missions.filter(
    (m) => !m.is_claimed && m.current_progress >= m.target_count,
  ).length;

  return (
    <YomuShell mode="learner">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-8 md:px-8 lg:px-10">
        <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white/82 shadow-[0_28px_70px_-42px_rgba(59,86,64,0.35)]">
          <div className="space-y-5 border-b border-zinc-200/70 bg-[linear-gradient(135deg,_rgba(255,238,190,0.92),_rgba(231,246,239,0.84))] px-6 py-7 lg:px-8">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900"
            >
              <ArrowLeft className="size-4" />
              Kembali ke dashboard
            </Link>
            <Badge className="w-fit bg-emerald-700 px-3 py-1 text-white">Gamifikasi</Badge>
            <div>
              <h1 className="text-4xl font-semibold leading-tight">Misi & Pencapaian</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600">{message}</p>
              {actionMessage ? (
                <p className="mt-2 text-sm font-medium text-emerald-800">{actionMessage}</p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-auto min-h-9 rounded-full px-4 py-2"
                onClick={() => void loadData()}
                disabled={loading}
              >
                <RefreshCw className={`mr-2 size-4 ${loading ? "animate-spin" : ""}`} />
                Muat ulang
              </Button>
              <div className="rounded-full bg-white/70 px-4 py-2 text-sm text-zinc-700">
                {completedCount} pencapaian selesai
              </div>
              <div className="rounded-full bg-white/70 px-4 py-2 text-sm text-zinc-700">
                {claimableCount} misi siap diklaim
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="size-5 text-emerald-700" />
              <h2 className="text-xl font-semibold">Misi harian</h2>
            </div>

            {loading ? (
              <Card className="border-black/5 bg-white/86">
                <CardContent className="flex items-center gap-3 p-5 text-sm text-zinc-600">
                  <RefreshCw className="size-4 animate-spin" />
                  Memuat misi...
                </CardContent>
              </Card>
            ) : null}

            {!loading && missions.length === 0 ? (
              <Card className="border-black/5 bg-white/86">
                <CardContent className="p-6 text-sm leading-6 text-zinc-600">
                  Belum ada misi aktif hari ini. Pastikan data misi di database sudah di-seed untuk
                  tanggal hari ini.
                </CardContent>
              </Card>
            ) : null}

            {!loading
              ? missions.map((mission) => {
                  const canClaim =
                    !mission.is_claimed && mission.current_progress >= mission.target_count;
                  const progressLabel = `${mission.current_progress}/${mission.target_count}`;

                  return (
                    <Card key={mission.mission_id} className="border-black/5 bg-white/86">
                      <CardContent className="space-y-4 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold leading-tight">{mission.description}</h3>
                            <p className="mt-1 text-sm text-zinc-500">
                              {mission.mission_type} · {mission.reward_points} poin
                            </p>
                          </div>
                          {mission.is_claimed ? (
                            <Badge variant="secondary">Sudah diklaim</Badge>
                          ) : canClaim ? (
                            <Badge className="bg-emerald-700 text-white">Siap diklaim</Badge>
                          ) : (
                            <Badge variant="outline">{progressLabel}</Badge>
                          )}
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                          <div
                            className="h-full rounded-full bg-emerald-600 transition-all"
                            style={{
                              width: `${Math.min(
                                100,
                                (mission.current_progress / Math.max(mission.target_count, 1)) *
                                  100,
                              )}%`,
                            }}
                          />
                        </div>
                        {canClaim ? (
                          <Button
                            type="button"
                            className="w-full sm:w-auto"
                            disabled={claimingId === mission.mission_id}
                            onClick={() => void handleClaim(mission)}
                          >
                            {claimingId === mission.mission_id ? "Mengklaim..." : "Klaim reward"}
                          </Button>
                        ) : null}
                      </CardContent>
                    </Card>
                  );
                })
              : null}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Award className="size-5 text-amber-700" />
              <h2 className="text-xl font-semibold">Pencapaian</h2>
            </div>

            {loading ? (
              <Card className="border-black/5 bg-white/86">
                <CardContent className="flex items-center gap-3 p-5 text-sm text-zinc-600">
                  <RefreshCw className="size-4 animate-spin" />
                  Memuat pencapaian...
                </CardContent>
              </Card>
            ) : null}

            {!loading && achievements.length === 0 ? (
              <Card className="border-black/5 bg-white/86">
                <CardContent className="p-6 text-sm leading-6 text-zinc-600">
                  Belum ada pencapaian. Selesaikan kuis atau aktivitas lain untuk mulai mengumpulkan
                  progres.
                </CardContent>
              </Card>
            ) : null}

            {!loading
              ? achievements.map((achievement) => (
                  <Card key={achievement.achievement_id} className="border-black/5 bg-white/86">
                    <CardContent className="space-y-4 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold leading-tight">{achievement.name}</h3>
                          <p className="mt-1 text-sm text-zinc-500">
                            {achievement.achievement_type} · target {achievement.milestone_target}
                          </p>
                        </div>
                        {achievement.is_completed ? (
                          <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                        ) : (
                          <Badge variant="outline">
                            {achievement.current_progress}/{achievement.milestone_target}
                          </Badge>
                        )}
                      </div>

                      {achievement.is_completed ? (
                        <div className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3">
                          <div>
                            <p className="text-sm font-medium">Tampilkan di profil</p>
                            <p className="text-xs text-zinc-500">
                              Hanya pencapaian selesai yang bisa ditampilkan
                            </p>
                          </div>
                          <Switch
                            checked={achievement.is_shown_on_profile}
                            disabled={togglingId === achievement.achievement_id}
                            onCheckedChange={(checked) =>
                              void handleToggleProfile(achievement, checked)
                            }
                          />
                        </div>
                      ) : (
                        <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                          <div
                            className="h-full rounded-full bg-amber-500 transition-all"
                            style={{
                              width: `${Math.min(
                                100,
                                (achievement.current_progress /
                                  Math.max(achievement.milestone_target, 1)) *
                                  100,
                              )}%`,
                            }}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              : null}
          </div>
        </div>
      </section>
    </YomuShell>
  );
}

export default function AchievementsPage() {
  return <LearnerGuard>{(user) => <AchievementsContent user={user} />}</LearnerGuard>;
}
