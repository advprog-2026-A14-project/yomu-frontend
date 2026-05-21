"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCurrentUserId, getStoredAuthToken } from "@/src/lib/api/auth";
import {
  getClanDetail,
  getPendingRequests,
  approveJoinRequest,
  rejectJoinRequest,
  deleteClan,
} from "@/src/lib/api/clan";
import { toast } from "sonner";
import ClanDetailCard from "@/src/features/league/components/ClanDetailCard";
import PendingRequestsList from "@/src/features/league/components/PendingRequestsList";
import JoinRequestButton from "@/src/features/league/components/JoinRequestButton";
import { Button } from "@/src/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { ArrowLeft, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import type { ClanDetail, JoinRequest } from "@/src/types/clan";

export default function ClanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clanId = params.clanId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clan, setClan] = useState<ClanDetail | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [pendingRequests, setPendingRequests] = useState<JoinRequest[]>([]);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
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

    const clanRes = await getClanDetail(clanId);
    if (!clanRes.success || !("data" in clanRes) || !clanRes.data) {
      setError(clanRes.message || "Klan tidak ditemukan");
      setLoading(false);
      return;
    }

    const clanData = clanRes.data;
    setClan(clanData);

    const isLeader = clanData.leader_id === uid;
    if (isLeader) {
      const reqRes = await getPendingRequests(clanId, uid);
      if (reqRes.response.success && "data" in reqRes.response && reqRes.response.data) {
        setPendingRequests(reqRes.response.data);
      }
    }

    setLoading(false);
  }, [clanId, router]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleApprove(requestId: string) {
    if (!userId) return;
    const res = await approveJoinRequest(requestId, userId);
    if (res.success) {
      toast.success("Anggota telah disetujui");
      load();
    } else {
      toast.error(res.message || "Gagal menyetujui");
    }
  }

  async function handleReject(requestId: string) {
    if (!userId) return;
    const res = await rejectJoinRequest(requestId, userId);
    if (res.success) {
      toast.success("Permintaan ditolak");
      load();
    } else {
      toast.error(res.message || "Gagal menolak");
    }
  }

  async function handleDelete() {
    if (!userId || !clan) return;
    setDeleting(true);
    const res = await deleteClan(clan.id, userId);
    if (res.success) {
      toast.success("Klan telah dihapus");
      router.push("/clans");
    } else {
      toast.error(res.message || "Gagal menghapus klan");
      setDeleting(false);
    }
  }

  if (loading) {
    return <ClanDetailSkeleton />;
  }

  if (error || !clan) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link
          href="/clans"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Klan
        </Link>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg text-destructive">{error ?? "Klan tidak ditemukan"}</p>
          <button
            onClick={load}
            className="mt-4 rounded bg-primary px-4 py-2 text-primary-foreground"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const isLeader = userId === clan.leader_id;
  const isMember = clan.members.some((m) => m.user_id === userId);
  const isNotMember = !isMember;

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <Link
        href="/clans"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Klan
      </Link>

      <ClanDetailCard clan={clan} />

      {isLeader && (
        <PendingRequestsList
          requests={pendingRequests}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {isNotMember && userId && (
        <div className="flex justify-center">
          <JoinRequestButton clanId={clan.id} userId={userId} onSuccess={load} />
        </div>
      )}

      {isLeader && (
        <div className="flex justify-end border-t pt-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus Klan
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Klan</AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini tidak dapat dibatalkan. Semua anggota akan
                  dikeluarkan dari klan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
                <AlertDialogAction
                  disabled={deleting}
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}

function ClanDetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      <div className="h-48 animate-pulse rounded-lg bg-muted" />
      <div className="h-32 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}
