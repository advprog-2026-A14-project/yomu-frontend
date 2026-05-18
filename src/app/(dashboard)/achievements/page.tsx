"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Award, BookOpenCheck, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { me, type User } from "@/src/lib/api/auth";
import type { Achievement } from "@/src/features/gamification/actions";

const achievements: Achievement[] = [
  {
    id: "first-login",
    title: "Masuk Yomu",
    description: "Sesi user valid melalui Java JWT.",
    rarity: "common",
    earned_at: "aktif",
  },
  {
    id: "first-quiz",
    title: "Kuis Pertama",
    description: "Terkunci sampai attempt quiz pertama tersimpan.",
    rarity: "rare",
    earned_at: null,
  },
  {
    id: "league-ready",
    title: "League Ready",
    description: "Terkunci sampai user punya clan di Rust Engine.",
    rarity: "epic",
    earned_at: null,
  },
];

const rarityClass: Record<Achievement["rarity"], string> = {
  common: "bg-zinc-100 text-zinc-700",
  rare: "bg-sky-100 text-sky-700",
  epic: "bg-violet-100 text-violet-700",
  legendary: "bg-amber-100 text-amber-700",
};

export default function AchievementsPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const load = async () => {
      const response = await me();
      if (response.response.success && "data" in response.response && response.response.data) {
        setUser(response.response.data);
      }
    };

    load();
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f8f4] px-5 py-6 text-zinc-950 md:px-8">
      <section className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="rounded-[2rem] border border-black/5 bg-white p-6">
          <Button asChild variant="ghost" className="w-fit rounded-full px-0 text-zinc-500 hover:bg-transparent">
            <Link href="/app">
              <ArrowLeft className="size-4" />
              Dashboard
            </Link>
          </Button>
          <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <Award className="size-5" />
              </div>
              <h1 className="mt-4 text-3xl font-semibold">Achievements</h1>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                {user ? `Badge untuk ${user.display_name}.` : "Memuat user..."}
              </p>
            </div>
            <Button asChild className="rounded-full bg-zinc-950 text-white hover:bg-zinc-800">
              <Link href="/leaderboard">Lihat leaderboard</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {achievements.map((achievement, index) => {
            const Icon = index === 0 ? ShieldCheck : index === 1 ? BookOpenCheck : Sparkles;

            return (
              <Card key={achievement.id} className={`border-black/5 bg-white ${achievement.earned_at ? "" : "opacity-70"}`}>
                <CardContent className="space-y-5 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-zinc-950 text-white">
                      <Icon className="size-5" />
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs ${rarityClass[achievement.rarity]}`}>
                      {achievement.rarity}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{achievement.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">{achievement.description}</p>
                  </div>
                  <p className="text-sm text-zinc-500">{achievement.earned_at ?? "Locked"}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}
