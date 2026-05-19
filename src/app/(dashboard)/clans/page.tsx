"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

import { me, type User } from "@/src/lib/api/auth";
import { createClan, getUserTier } from "@/src/lib/api/league";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";

type TierInfo = {
  user_id: string;
  clan_id: string | null;
  clan_name: string | null;
  tier: string | null;
};

export default function ClansPage() {
  const [user, setUser] = useState<User | null>(null);
  const [tierInfo, setTierInfo] = useState<TierInfo | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("Memuat session...");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const session = await me();

      if (!active) {
        return;
      }

      if (!session.response.success || !("data" in session.response) || !session.response.data) {
        setMessage(session.response.message);
        return;
      }

      setUser(session.response.data);
      const tierResponse = await getUserTier(session.response.data.user_id);

      if (!active) {
        return;
      }

      if (tierResponse.success && "data" in tierResponse && tierResponse.data) {
        setTierInfo(tierResponse.data);
        setMessage("Data tier aktif dari Rust Engine.");
        return;
      }

      setMessage(tierResponse.message);
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  const onCreateClan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user || !name.trim()) {
      return;
    }

    setSubmitting(true);
    const response = await createClan(name.trim(), user.user_id);
    setSubmitting(false);

    if (!response.success) {
      setMessage(response.message);
      return;
    }

    setMessage("Clan berhasil dibuat. Refresh data tier setelah Rust selesai memproses membership.");
    setName("");
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-6 text-zinc-950 sm:px-5 md:px-8">
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="min-w-0">
          <Link href="/app" className="text-sm text-zinc-500 hover:text-zinc-900">
            Kembali ke hub
          </Link>
          <h1 className="mt-3 text-3xl font-semibold leading-tight">Clan</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{message}</p>
        </div>

        <Card className="border-zinc-200 bg-white">
          <CardContent className="grid min-w-0 gap-4 p-5 md:grid-cols-3">
            <div className="min-w-0">
              <p className="text-xs text-zinc-500 uppercase">User</p>
              <p className="mt-1 font-semibold">{user?.display_name ?? "-"}</p>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-zinc-500 uppercase">Clan</p>
              <p className="mt-1 font-semibold">{tierInfo?.clan_name ?? "Belum ada clan"}</p>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-zinc-500 uppercase">Tier</p>
              <p className="mt-1 font-semibold">{tierInfo?.tier ?? "-"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 bg-white">
          <CardContent className="space-y-4 p-5">
            <div>
              <h2 className="font-semibold">Buat Clan</h2>
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                Form ini memanggil Rust `POST /api/v1/clans` langsung dari browser dan memakai `user_id` dari session.
              </p>
            </div>
            <form className="flex min-w-0 flex-col gap-3 sm:flex-row" onSubmit={onCreateClan}>
              <Input
                className="min-w-0"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nama clan"
                disabled={!user || submitting}
                required
              />
              <Button
                type="submit"
                className="h-auto min-h-9 whitespace-normal px-4 py-2 text-center"
                disabled={!user || submitting}
              >
                {submitting ? "Membuat..." : "Buat Clan"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
