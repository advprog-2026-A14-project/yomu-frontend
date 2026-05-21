"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserId, getStoredAuthToken } from "@/src/lib/api/auth";
import { getUserTier } from "@/src/lib/api/clan";
import { toast } from "sonner";
import ClanHomeCard from "@/src/features/league/components/ClanHomeCard";
import CreateClanForm from "@/src/features/league/components/CreateClanForm";
import type { UserTierInfo } from "@/src/types/clan";

export default function ClansPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [clanInfo, setClanInfo] = useState<UserTierInfo | null>(null);

  async function load() {
    setLoading(true);
    setError(null);

    const token = getStoredAuthToken();
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    const uid = await getCurrentUserId();
    if (!uid) {
      router.replace("/auth/login");
      return;
    }
    setUserId(uid);

    const res = await getUserTier(uid);
    if (res.success && "data" in res && res.data) {
      setClanInfo(res.data);
    } else if (!res.success) {
      if (res.message?.includes("not found") || res.message?.includes("belum")) {
        setClanInfo({
          user_id: uid,
          clan_id: null,
          clan_name: null,
          tier: null,
        });
      } else {
        setError(res.message || "Gagal memuat data klan");
        toast.error(res.message || "Gagal memuat data klan");
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <ClansPageSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-destructive">{error}</p>
        <button
          onClick={load}
          className="mt-4 rounded bg-primary px-4 py-2 text-primary-foreground"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold">Klan</h1>
        <p className="mt-1 text-muted-foreground">
          Kelola klan dan bergabung dengan komunitas
        </p>
      </div>

      {clanInfo?.clan_id ? (
        <ClanHomeCard clanInfo={clanInfo} />
      ) : (
        <div className="space-y-6">
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-lg text-muted-foreground">
              Kamu belum tergabung dalam klan mana pun.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Buat klan baru atau minta bergabung dengan klan yang sudah ada.
            </p>
          </div>
          {userId && <CreateClanForm userId={userId} onSuccess={load} />}
        </div>
      )}
    </div>
  );
}

function ClansPageSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8">
      <div className="h-9 w-24 animate-pulse rounded bg-muted" />
      <div className="h-48 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}
