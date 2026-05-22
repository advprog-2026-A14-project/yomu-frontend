"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Award, CheckCircle2, KeyRound, Mail, Trash2, UserRound } from "lucide-react";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  deleteAccount,
  me,
  updateLoginIdentifiers,
  updatePassword,
  updateProfile,
  type User,
} from "@/src/lib/api/auth";
import { getUserAchievements, type UserAchievementItem } from "@/src/lib/api/gamification";

const RARITY_COLOR: Record<string, string> = {
  Common: "bg-zinc-100 text-zinc-700 border-zinc-200",
  Rare: "bg-blue-50 text-blue-700 border-blue-200",
  Epic: "bg-purple-50 text-purple-700 border-purple-200",
  Legendary: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profileForm, setProfileForm] = useState({ username: "", display_name: "" });
  const [identifierForm, setIdentifierForm] = useState({ email: "", phone_number: "" });
  const [passwordForm, setPasswordForm] = useState({ current_password: "", new_password: "" });
  const [message, setMessage] = useState("Memuat profil...");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [achievements, setAchievements] = useState<UserAchievementItem[]>([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const result = await me();

      if (!active) {
        return;
      }

      if (!result.response.success || !("data" in result.response) || !result.response.data) {
        if (result.status === 401 || result.status === 403) {
          router.replace("/auth/login");
          return;
        }

        setError(result.response.message);
        setMessage("Profil belum bisa dimuat.");
        return;
      }

      const currentUser = result.response.data;
      setUser(currentUser);
      setProfileForm({
        username: currentUser.username ?? "",
        display_name: currentUser.display_name ?? "",
      });
      setIdentifierForm({
        email: currentUser.email ?? "",
        phone_number: currentUser.phone_number ?? "",
      });
      setMessage("Kelola identitas akun yang dipakai lintas modul Yomu.");

      const achRes = await getUserAchievements(currentUser.user_id);
      if (achRes.success && "data" in achRes && achRes.data) {
        setAchievements(
          achRes.data.achievements.filter((a) => a.is_completed && a.is_shown_on_profile),
        );
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [router]);

  const runAction = async (key: string, action: () => Promise<{ success: boolean; message: string }>) => {
    setBusy(key);
    setError(null);
    const response = await action();
    setBusy(null);

    if (!response.success) {
      setError(response.message);
      return;
    }

    setMessage(response.message);
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await runAction("profile", async () => {
      const response = await updateProfile({
        username: profileForm.username.trim(),
        display_name: profileForm.display_name.trim(),
      });

      if (response.success && "data" in response && response.data) {
        setUser(response.data);
      }

      return response;
    });
  };

  const saveIdentifiers = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await runAction("identifiers", async () => {
      const response = await updateLoginIdentifiers({
        email: identifierForm.email.trim(),
        phone_number: identifierForm.phone_number.trim(),
      });

      if (response.success && "data" in response && response.data) {
        setUser(response.data);
      }

      return response;
    });
  };

  const savePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await runAction("password", async () => updatePassword(passwordForm));
    setPasswordForm({ current_password: "", new_password: "" });
  };

  const removeAccount = async () => {
    const confirmed = window.confirm("Hapus akun Yomu ini? Aksi ini tidak bisa dibatalkan.");

    if (!confirmed) {
      return;
    }

    setBusy("delete");
    setError(null);
    const response = await deleteAccount();
    setBusy(null);

    if (!response.success) {
      setError(response.message);
      return;
    }

    router.replace("/auth/login");
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f4efe3_0%,_#f7f7f4_38%,_#eef4ef_100%)] px-5 py-8 text-zinc-950 md:px-8 lg:px-10">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-black/5 bg-white/82 px-6 py-7 shadow-[0_28px_70px_-42px_rgba(59,86,64,0.35)] md:flex-row md:items-end md:justify-between md:px-8">
          <div className="min-w-0">
            <Link href="/app" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900">
              <ArrowLeft className="size-4" />
              Kembali ke dashboard
            </Link>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">Profil Akun</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">{message}</p>
          </div>
          <div className="rounded-[1.5rem] bg-zinc-950 px-5 py-4 text-white">
            <p className="text-xs tracking-[0.18em] text-zinc-400 uppercase">Role</p>
            <p className="mt-2 text-2xl font-semibold">{user?.role ?? "-"}</p>
          </div>
        </div>

        {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="border-black/5 bg-white/86">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                  <UserRound className="size-5" />
                </div>
                <div>
                  <h2 className="font-semibold">Identitas Publik</h2>
                  <p className="text-sm text-zinc-500">Username dan display name.</p>
                </div>
              </div>
              <form className="space-y-4" onSubmit={saveProfile}>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={profileForm.username}
                    onChange={(event) => setProfileForm((current) => ({ ...current, username: event.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display-name">Display name</Label>
                  <Input
                    id="display-name"
                    value={profileForm.display_name}
                    onChange={(event) =>
                      setProfileForm((current) => ({ ...current, display_name: event.target.value }))
                    }
                  />
                </div>
                <Button type="submit" className="rounded-full" disabled={busy === "profile"}>
                  {busy === "profile" ? "Menyimpan..." : "Simpan Profil"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-black/5 bg-white/86">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                  <Mail className="size-5" />
                </div>
                <div>
                  <h2 className="font-semibold">Login Identifier</h2>
                  <p className="text-sm text-zinc-500">Email atau nomor HP.</p>
                </div>
              </div>
              <form className="space-y-4" onSubmit={saveIdentifiers}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={identifierForm.email}
                    onChange={(event) => setIdentifierForm((current) => ({ ...current, email: event.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor HP</Label>
                  <Input
                    id="phone"
                    value={identifierForm.phone_number}
                    onChange={(event) =>
                      setIdentifierForm((current) => ({ ...current, phone_number: event.target.value }))
                    }
                  />
                </div>
                <Button type="submit" className="rounded-full" disabled={busy === "identifiers"}>
                  {busy === "identifiers" ? "Menyimpan..." : "Simpan Identifier"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-black/5 bg-white/86">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                  <KeyRound className="size-5" />
                </div>
                <div>
                  <h2 className="font-semibold">Keamanan</h2>
                  <p className="text-sm text-zinc-500">Password dan hapus akun.</p>
                </div>
              </div>
              <form className="space-y-4" onSubmit={savePassword}>
                <div className="space-y-2">
                  <Label htmlFor="current-password">Password saat ini</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwordForm.current_password}
                    onChange={(event) =>
                      setPasswordForm((current) => ({ ...current, current_password: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Password baru</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwordForm.new_password}
                    onChange={(event) =>
                      setPasswordForm((current) => ({ ...current, new_password: event.target.value }))
                    }
                    minLength={8}
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button type="submit" className="rounded-full" disabled={busy === "password"}>
                    {busy === "password" ? "Menyimpan..." : "Ubah Password"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                    onClick={removeAccount}
                    disabled={busy === "delete"}
                  >
                    <Trash2 className="size-4" />
                    {busy === "delete" ? "Menghapus..." : "Hapus Akun"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="mb-4 flex items-center gap-2">
            <Award className="size-5 text-amber-600" />
            <h2 className="text-xl font-semibold">Pencapaian Publik</h2>
            <Link
              href="/achievements"
              className="ml-auto text-sm text-zinc-500 hover:text-zinc-900"
            >
              Kelola →
            </Link>
          </div>

          {achievements.length === 0 ? (
            <Card className="border-black/5 bg-white/86">
              <CardContent className="p-6 text-sm leading-6 text-zinc-500">
                Belum ada pencapaian yang ditampilkan di profil. Selesaikan pencapaian dan aktifkan
                &quot;Tampilkan di profil&quot; di halaman{" "}
                <Link href="/achievements" className="font-medium text-zinc-900 underline">
                  Misi &amp; Pencapaian
                </Link>
                .
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {achievements.map((ach) => (
                <Card key={ach.achievement_id} className="border-black/5 bg-white/86">
                  <CardContent className="flex items-start justify-between gap-3 p-5">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                        <p className="truncate font-semibold leading-tight">{ach.name}</p>
                      </div>
                      <p className="mt-1 text-sm text-zinc-500">
                        {ach.milestone_target} · {ach.reward_points} poin
                      </p>
                    </div>
                    <Badge
                      className={`shrink-0 border text-xs ${RARITY_COLOR[ach.achievement_type] ?? "bg-zinc-100 text-zinc-700"}`}
                    >
                      {ach.achievement_type}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
