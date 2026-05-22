"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Loader2, ShieldAlert, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";

import ClanDetailCard from "@/src/features/league/components/ClanDetailCard";
import PendingRequestsList from "@/src/features/league/components/PendingRequestsList";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { YomuShell } from "@/src/components/yomu/YomuShell";
import { getCurrentUserId, getStoredAuthToken } from "@/src/lib/api/auth";
import {
  approveJoinRequest,
  createJoinRequest,
  deleteClan,
  getClanDetail,
  getPendingRequests,
  rejectJoinRequest,
} from "@/src/lib/api/clan";
import type { ClanDetail, JoinRequest } from "@/src/types/clan";

export default function ClanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clanId = params.clanId as string;

  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<JoinRequest[]>([]);
  const [processingRequest, setProcessingRequest] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clan, setClan] = useState<ClanDetail | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

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
    setLoading(false);

    if (!clanRes.success || !("data" in clanRes) || !clanRes.data) {
      setError(clanRes.message || "Clan tidak ditemukan");
      return;
    }

    setClan(clanRes.data);
    if (clanRes.data.leader_id === uid) {
      const reqRes = await getPendingRequests(clanId, uid);
      if (reqRes.success && reqRes.data) {
        setPendingRequests(reqRes.data as unknown as JoinRequest[]);
      }
    }
  }, [clanId, router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const handleJoin = async () => {
    if (!userId || !clan) {
      return;
    }

    setJoining(true);
    const response = await createJoinRequest(clan.id, userId);
    setJoining(false);

    if (!response.success) {
      toast.error(response.message || "Gagal mengirim permintaan bergabung");
      return;
    }

    toast.success("Permintaan bergabung telah dikirim. Menunggu persetujuan leader.");
    await load();
  };

  const handleApproveRequest = async (requestId: string) => {
    if (!userId) return;

    setProcessingRequest(true);
    const res = await approveJoinRequest(requestId, userId);
    setProcessingRequest(false);

    if (!res.success) {
      toast.error(res.message || "Gagal menyetujui permintaan");
      return;
    }

    toast.success("Permintaan disetujui");
    await load();
  };

  const handleRejectRequest = async (requestId: string) => {
    if (!userId) return;

    setProcessingRequest(true);
    const res = await rejectJoinRequest(requestId, userId);
    setProcessingRequest(false);

    if (!res.success) {
      toast.error(res.message || "Gagal menolak permintaan");
      return;
    }

    toast.success("Permintaan ditolak");
    await load();
  };

  const handleDeleteClan = async () => {
    if (!userId || !clan) return;

    setDeleting(true);
    const res = await deleteClan(clanId, userId);
    setDeleting(false);
    setShowDeleteDialog(false);

    if (!res.success) {
      toast.error(res.message || "Gagal menghapus clan");
      return;
    }

    toast.success("Clan berhasil dihapus");
    router.replace("/clans");
  };

  const isMember = Boolean(clan?.members?.some((member) => member.user_id === userId));
  const isLeader = clan?.leader_id === userId;

  return (
    <YomuShell mode="learner">
      <div className="mx-auto max-w-5xl space-y-6 px-5 py-8 md:px-8 lg:px-10">
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/clans">
            <ArrowLeft className="size-4" />
            Kembali ke clan
          </Link>
        </Button>

        {loading ? <ClanDetailSkeleton /> : null}

        {error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="space-y-4 p-6">
              <p className="text-sm text-red-700">{error}</p>
              <Button type="button" variant="outline" className="rounded-full" onClick={() => void load()}>
                Coba lagi
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {clan ? (
          <>
            <ClanDetailCard clan={clan} />

            {!isMember && userId ? (
              <Card className="border-indigo-100 bg-indigo-50">
                <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-3">
                    <UserPlus className="mt-1 size-5 text-indigo-700" />
                    <div>
                      <p className="font-semibold text-indigo-950">Gabung clan</p>
                      <p className="mt-1 text-sm leading-6 text-indigo-950/75">
                        Bergabunglah jika kamu mengenal clan ini dan ingin ikut mengumpulkan skor bersama.
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    className="rounded-full bg-indigo-700 text-white hover:bg-indigo-800"
                    onClick={() => void handleJoin()}
                    disabled={joining}
                  >
                    {joining ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
                    {joining ? "Bergabung..." : "Gabung clan"}
                  </Button>
                </CardContent>
              </Card>
            ) : null}

            {isLeader ? (
              <>
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="flex items-start gap-3 p-6">
                    <ShieldAlert className="mt-1 size-5 text-amber-700" />
                    <div className="flex-1">
                      <p className="font-semibold text-amber-950">Fitur Leader</p>
                      <p className="mt-1 text-sm leading-6 text-amber-950/75">
                        Kelola permintaan bergabung dan aktifkan fitur clan.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-full border-red-200 text-red-700 hover:bg-red-50"
                          onClick={() => setShowDeleteDialog(true)}
                        >
                          <Trash2 className="size-4" />
                          Hapus Clan
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <PendingRequestsList
                  requests={pendingRequests}
                  onApprove={handleApproveRequest}
                  onReject={handleRejectRequest}
                  isLoading={processingRequest}
                />
              </>
            ) : null}
          </>
        ) : null}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Clan?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Clan &quot;{clan?.name}&quot; dan semua datanya akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => void handleDeleteClan()}
              disabled={deleting}
            >
              {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
              Hapus Clan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </YomuShell>
  );
}

function ClanDetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-36 animate-pulse rounded-[1.5rem] bg-white/70" />
      <div className="h-64 animate-pulse rounded-[1.5rem] bg-white/70" />
    </div>
  );
}