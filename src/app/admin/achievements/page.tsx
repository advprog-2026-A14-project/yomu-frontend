"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, RefreshCw } from "lucide-react";

import { AdminGuard } from "@/src/components/yomu/AdminGuard";
import { YomuShell } from "@/src/components/yomu/YomuShell";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  adminCreateAchievement,
  type CreateAchievementData,
} from "@/src/lib/api/gamification";
import type { AchievementType, TriggerType } from "@/src/types/gamification";

const ACHIEVEMENT_TYPES: AchievementType[] = ["Common", "Rare", "Epic", "Legendary"];
const TRIGGER_TYPES: { value: TriggerType; label: string }[] = [
  { value: "QuizComplete", label: "Selesaikan kuis" },
  { value: "ReadArticle", label: "Baca artikel" },
  { value: "DailyLogin", label: "Login harian" },
];

const RARITY_COLOR: Record<AchievementType, string> = {
  Common: "bg-zinc-100 text-zinc-700",
  Rare: "bg-blue-100 text-blue-700",
  Epic: "bg-purple-100 text-purple-700",
  Legendary: "bg-amber-100 text-amber-700",
};

type FormState = {
  name: string;
  milestone_target: string;
  achievement_type: AchievementType;
  trigger_type: TriggerType;
  reward_points: string;
};

const emptyForm: FormState = {
  name: "",
  milestone_target: "10",
  achievement_type: "Common",
  trigger_type: "QuizComplete",
  reward_points: "50",
};

function AdminAchievementsContent() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [created, setCreated] = useState<CreateAchievementData[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    const milestoneTarget = parseInt(form.milestone_target, 10);
    const rewardPoints = parseInt(form.reward_points, 10);

    if (isNaN(milestoneTarget) || milestoneTarget <= 0) {
      setError("Target milestone harus angka positif.");
      setSubmitting(false);
      return;
    }

    if (isNaN(rewardPoints) || rewardPoints < 0) {
      setError("Reward points harus angka non-negatif.");
      setSubmitting(false);
      return;
    }

    const res = await adminCreateAchievement({
      name: form.name.trim(),
      milestone_target: milestoneTarget,
      achievement_type: form.achievement_type,
      trigger_type: form.trigger_type,
      reward_points: rewardPoints,
    });

    setSubmitting(false);

    if (!res.success || !("data" in res) || !res.data) {
      setError(res.message);
      return;
    }

    setCreated((prev) => [res.data!, ...prev]);
    setMessage(`Achievement "${res.data.name}" berhasil dibuat.`);
    setForm(emptyForm);
  };

  return (
    <YomuShell mode="admin">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-5 py-8 md:px-8 lg:px-10">
        <div className="rounded-[2rem] border border-black/5 bg-white/82 px-6 py-7 shadow-[0_28px_70px_-42px_rgba(59,86,64,0.35)]">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900"
          >
            <ArrowLeft className="size-4" />
            Kembali ke admin
          </Link>
          <h1 className="mt-4 text-3xl font-semibold">Kelola Achievement</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Buat achievement baru yang akan dikumpulkan pelajar.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-black/5 bg-white/86">
            <CardContent className="p-6">
              <div className="mb-5 flex items-center gap-2">
                <Plus className="size-5 text-emerald-700" />
                <h2 className="text-lg font-semibold">Buat achievement baru</h2>
              </div>

              {error ? (
                <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
              ) : null}
              {message ? (
                <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  {message}
                </p>
              ) : null}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="ach-name">Nama achievement</Label>
                  <Input
                    id="ach-name"
                    required
                    value={form.name}
                    placeholder="Contoh: Pembaca Setia"
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="ach-target">Target milestone</Label>
                    <Input
                      id="ach-target"
                      type="number"
                      min={1}
                      required
                      value={form.milestone_target}
                      onChange={(e) => setForm((f) => ({ ...f, milestone_target: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ach-reward">Reward poin</Label>
                    <Input
                      id="ach-reward"
                      type="number"
                      min={0}
                      required
                      value={form.reward_points}
                      onChange={(e) => setForm((f) => ({ ...f, reward_points: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Rarity</Label>
                  <Select
                    value={form.achievement_type}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, achievement_type: v as AchievementType }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ACHIEVEMENT_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Trigger</Label>
                  <Select
                    value={form.trigger_type}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, trigger_type: v as TriggerType }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TRIGGER_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" disabled={submitting} className="w-full rounded-xl">
                  {submitting ? "Membuat..." : "Buat achievement"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Baru dibuat sesi ini</h2>
            {created.length === 0 ? (
              <Card className="border-black/5 bg-white/86">
                <CardContent className="p-6 text-sm text-zinc-500">
                  Achievement yang kamu buat akan muncul di sini.
                </CardContent>
              </Card>
            ) : (
              created.map((ach) => (
                <Card key={ach.achievement_id} className="border-black/5 bg-white/86">
                  <CardContent className="flex items-start justify-between gap-3 p-5">
                    <div>
                      <p className="font-semibold leading-tight">{ach.name}</p>
                      <p className="mt-1 text-sm text-zinc-500">
                        Target {ach.milestone_target} · {ach.reward_points} poin
                      </p>
                      <p className="mt-0.5 text-xs text-zinc-400">{ach.trigger_type}</p>
                    </div>
                    <Badge className={RARITY_COLOR[ach.achievement_type as AchievementType]}>
                      {ach.achievement_type}
                    </Badge>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>
    </YomuShell>
  );
}

export default function AdminAchievementsPage() {
  return <AdminGuard>{() => <AdminAchievementsContent />}</AdminGuard>;
}
