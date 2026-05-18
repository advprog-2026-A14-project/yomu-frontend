"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Circle, LockKeyhole, Target } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import { me, type User } from "@/src/lib/api/auth";
import type { Mission } from "@/src/features/gamification/actions";

const missions: Mission[] = [
  {
    id: "read-1",
    title: "Selesaikan satu bacaan",
    description: "Progress bertambah setelah attempt quiz tersimpan.",
    progress: 0,
    target: 1,
    status: "active",
  },
  {
    id: "score-80",
    title: "Capai score 80",
    description: "Gunakan hasil submit quiz terbaru.",
    progress: 0,
    target: 80,
    status: "active",
  },
  {
    id: "clan-ready",
    title: "Bergabung ke clan",
    description: "Sinkron dengan fitur league Rust Engine.",
    progress: 0,
    target: 1,
    status: "locked",
  },
];

function MissionIcon({ status }: { status: Mission["status"] }) {
  if (status === "locked") {
    return <LockKeyhole className="size-5" />;
  }

  if (status === "claimed") {
    return <CheckCircle2 className="size-5" />;
  }

  return <Circle className="size-5" />;
}

export default function MissionsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const response = await me();
      if (response.response.success && "data" in response.response && response.response.data) {
        setUser(response.response.data);
        return;
      }

      setError(response.response.message);
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
              <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Target className="size-5" />
              </div>
              <h1 className="mt-4 text-3xl font-semibold">Missions</h1>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                {user ? `Target belajar untuk ${user.display_name}.` : error ?? "Memuat user..."}
              </p>
            </div>
            <Button asChild className="rounded-full bg-zinc-950 text-white hover:bg-zinc-800">
              <Link href="/bacaankuis">Mulai dari bacaan</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {missions.map((mission) => {
            const percent = Math.min(100, Math.round((mission.progress / mission.target) * 100));

            return (
              <Card key={mission.id} className="border-black/5 bg-white">
                <CardContent className="space-y-5 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-zinc-950 text-white">
                      <MissionIcon status={mission.status} />
                    </div>
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600">{mission.status}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{mission.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">{mission.description}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-zinc-500">
                      <span>{mission.progress}</span>
                      <span>{mission.target}</span>
                    </div>
                    <Progress value={percent} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-black/5 bg-zinc-950 text-white">
          <CardContent className="p-6">
            <p className="text-sm leading-7 text-zinc-300">
              Rust gamification mission routes belum aktif dari entrypoint backend saat ini. Page ini tetap
              tersambung ke auth session dan siap diganti ke endpoint mission saat service sudah dimount.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
