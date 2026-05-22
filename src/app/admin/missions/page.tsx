"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";

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
  adminCreateDailyMission,
  adminDeleteDailyMission,
  adminUpdateDailyMission,
  type CreateMissionData,
} from "@/src/lib/api/gamification";
import type { MissionType } from "@/src/types/gamification";

const MISSION_TYPES: { value: MissionType; label: string }[] = [
  { value: "ReadArticle", label: "Baca artikel" },
  { value: "Quiz", label: "Selesaikan kuis" },
  { value: "DailyLogin", label: "Login harian" },
];

type FormState = {
  description: string;
  target_count: string;
  date: string;
  reward_points: string;
  mission_type: MissionType;
};

const emptyForm = (): FormState => ({
  description: "",
  target_count: "3",
  date: new Date().toISOString().slice(0, 10),
  reward_points: "100",
  mission_type: "ReadArticle",
});

function AdminMissionsContent() {
  const [form, setForm] = useState<FormState>(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [missions, setMissions] = useState<CreateMissionData[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
    setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    const targetCount = parseInt(form.target_count, 10);
    const rewardPoints = parseInt(form.reward_points, 10);

    if (isNaN(targetCount) || targetCount <= 0) {
      setError("Target count harus angka positif.");
      setSubmitting(false);
      return;
    }

    if (isNaN(rewardPoints) || rewardPoints < 0) {
      setError("Reward points harus angka non-negatif.");
      setSubmitting(false);
      return;
    }

    const payload = {
      description: form.description.trim(),
      target_count: targetCount,
      date: form.date,
      reward_points: rewardPoints,
      mission_type: form.mission_type,
    };

    if (editingId) {
      const res = await adminUpdateDailyMission(editingId, payload);
      setSubmitting(false);

      if (!res.success || !("data" in res) || !res.data) {
        setError(res.message);
        return;
      }

      setMissions((prev) =>
        prev.map((m) => (m.mission_id === editingId ? res.data! : m)),
      );
      setMessage("Misi harian berhasil diperbarui.");
      resetForm();
      return;
    }

    const res = await adminCreateDailyMission(payload);
    setSubmitting(false);

    if (!res.success || !("data" in res) || !res.data) {
      setError(res.message);
      return;
    }

    setMissions((prev) => [res.data!, ...prev]);
    setMessage("Misi harian berhasil dibuat.");
    resetForm();
  };

  const startEdit = (mission: CreateMissionData) => {
    setEditingId(mission.mission_id);
    setForm({
      description: mission.description,
      target_count: String(mission.target_count),
      date: new Date().toISOString().slice(0, 10),
      reward_points: String(mission.reward_points),
      mission_type: mission.mission_type as MissionType,
    });
    setMessage(null);
    setError(null);
  };

  const handleDelete = async (missionId: string) => {
    const confirmed = window.confirm("Hapus misi harian ini?");

    if (!confirmed) return;

    setDeletingId(missionId);
    setMessage(null);
    setError(null);

    const res = await adminDeleteDailyMission(missionId);
    setDeletingId(null);

    if (!res.success) {
      setError(res.message);
      return;
    }

    setMissions((prev) => prev.filter((m) => m.mission_id !== missionId));
    setMessage("Misi harian berhasil dihapus.");
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
          <h1 className="mt-4 text-3xl font-semibold">Kelola Misi Harian</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Buat, ubah, atau hapus misi harian untuk pelajar.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-black/5 bg-white/86">
            <CardContent className="p-6">
              <div className="mb-5 flex items-center gap-2">
                <Plus className="size-5 text-emerald-700" />
                <h2 className="text-lg font-semibold">
                  {editingId ? "Edit misi" : "Buat misi baru"}
                </h2>
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
                  <Label htmlFor="mission-desc">Deskripsi</Label>
                  <Input
                    id="mission-desc"
                    required
                    value={form.description}
                    placeholder="Contoh: Baca 3 Artikel Hari Ini"
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="mission-target">Target</Label>
                    <Input
                      id="mission-target"
                      type="number"
                      min={1}
                      required
                      value={form.target_count}
                      onChange={(e) => setForm((f) => ({ ...f, target_count: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mission-reward">Reward poin</Label>
                    <Input
                      id="mission-reward"
                      type="number"
                      min={0}
                      required
                      value={form.reward_points}
                      onChange={(e) => setForm((f) => ({ ...f, reward_points: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mission-date">Tanggal aktif</Label>
                  <Input
                    id="mission-date"
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tipe misi</Label>
                  <Select
                    value={form.mission_type}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, mission_type: v as MissionType }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MISSION_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={submitting} className="flex-1 rounded-xl">
                    {submitting
                      ? editingId
                        ? "Menyimpan..."
                        : "Membuat..."
                      : editingId
                        ? "Simpan perubahan"
                        : "Buat misi"}
                  </Button>
                  {editingId ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl"
                      onClick={resetForm}
                    >
                      Batal
                    </Button>
                  ) : null}
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Dibuat sesi ini</h2>
            {missions.length === 0 ? (
              <Card className="border-black/5 bg-white/86">
                <CardContent className="p-6 text-sm text-zinc-500">
                  Misi yang kamu buat akan muncul di sini.
                </CardContent>
              </Card>
            ) : (
              missions.map((mission) => (
                <Card key={mission.mission_id} className="border-black/5 bg-white/86">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold leading-tight">
                          {mission.description}
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                          Target {mission.target_count} · {mission.reward_points} poin
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {mission.mission_type}
                        </Badge>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="size-8 rounded-lg"
                          onClick={() => startEdit(mission)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="size-8 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
                          disabled={deletingId === mission.mission_id}
                          onClick={() => void handleDelete(mission.mission_id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
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

export default function AdminMissionsPage() {
  return <AdminGuard>{() => <AdminMissionsContent />}</AdminGuard>;
}
