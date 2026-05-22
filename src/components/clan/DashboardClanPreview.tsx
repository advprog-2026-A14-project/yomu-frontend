"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Shield, Users } from "lucide-react";

import { getCurrentUserId } from "@/src/lib/api/auth";
import { getUserTier } from "@/src/lib/api/clan";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import type { UserTierInfo } from "@/src/types/clan";

export function DashboardClanPreview() {
  const [clanInfo, setClanInfo] = useState<UserTierInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const uid = await getCurrentUserId();
      if (!uid) {
        setLoading(false);
        return;
      }

      const res = await getUserTier(uid);
      if (!active) return;

      if (res.success && "data" in res && res.data) {
        setClanInfo(res.data);
      }
      setLoading(false);
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="rounded-[2rem] border border-black/5 bg-white/82 shadow-[0_28px_70px_-42px_rgba(59,86,64,0.35)]">
      <div className="grid gap-0 lg:grid-cols-[1fr_1.05fr]">
        <div className="space-y-5 border-b border-zinc-200/70 bg-[linear-gradient(135deg,_rgba(215,237,248,0.9),_rgba(240,246,250,0.82))] px-6 py-7 lg:border-r lg:border-b-0 lg:px-8 lg:py-8">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/75 p-3 text-blue-700">
              <Shield className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900">Klan & League</p>
              <p className="text-sm text-zinc-600">Gamifikasi dari backend Rust</p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="max-w-xl text-3xl leading-tight font-semibold text-zinc-950">
              Bergabung dengan klan, naik level, dan bersaing di leaderboard.
            </h2>
            <p className="max-w-xl text-sm leading-7 text-zinc-600">
              Bangun klanmu sendiri atau bergabung dengan yang sudah ada. Kumpulkan XP, selesaikan
              misi, dan raih achievements bersama anggota klan.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-full bg-zinc-950 text-white hover:bg-zinc-800">
              <Link href="/clans">
                Buka klan
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            {clanInfo?.clan_id ? (
              <Button asChild variant="outline" className="rounded-full">
                <Link href={`/clans/${clanInfo.clan_id}`}>Lihat klan saya</Link>
              </Button>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {clanInfo?.clan_id ? (
              <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                <Users className="mr-1 size-3" />
                {clanInfo.clan_name ?? "Anggota klan"}
              </Badge>
            ) : (
              <Badge variant="outline" className="border-zinc-900/10 bg-white/65 text-zinc-700">
                Belum bergabung
              </Badge>
            )}
            {clanInfo?.tier && (
              <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                Tier {clanInfo.tier}
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-4 px-6 py-7 lg:px-8 lg:py-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-900">Status klan</p>
              <p className="text-sm text-zinc-500">Info keanggotaan kamu</p>
            </div>
          </div>

          {loading ? (
            <div className="rounded-[1.5rem] border border-dashed border-zinc-300 bg-zinc-50 px-5 py-8 text-sm text-zinc-500">
              Memuat status klan...
            </div>
          ) : clanInfo?.clan_id ? (
            <div className="grid gap-4">
              <Card className="overflow-hidden border-black/5 bg-white">
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                      <Shield className="size-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-950">{clanInfo.clan_name ?? "Klan"}</p>
                      <p className="text-sm text-zinc-600">
                        {clanInfo.tier ? `Tier ${clanInfo.tier}` : "Tanpa tier"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      Aktif
                    </span>
                    <span className="text-zinc-500">Anggota klan</span>
                  </div>
                  <Button asChild className="w-full rounded-full" variant="outline">
                    <Link href={`/clans/${clanInfo.clan_id}`}>
                      Buka halaman klan
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-zinc-300 bg-zinc-50 px-5 py-8 text-sm leading-6 text-zinc-500">
              Kamu belum terdaftar dalam klan mana pun.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}