"use client";

import { useState } from "react";
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
import { Loader2 } from "lucide-react";
import { createJoinRequest } from "@/src/lib/api/clan";
import { toast } from "sonner";

interface JoinRequestButtonProps {
  clanId: string;
  userId: string;
  onSuccess?: () => void;
}

export default function JoinRequestButton({
  clanId,
  userId,
  onSuccess,
}: JoinRequestButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    try {
      const res = await createJoinRequest({
        clan_id: clanId,
        user_id: userId,
      });
      if (res.success) {
        toast.success("Permintaan bergabung terkirim");
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(res.message || "Gagal mengirim permintaan");
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="lg" className="w-full sm:w-auto">
          Ajukan Bergabung
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bergabung ke Klan</AlertDialogTitle>
          <AlertDialogDescription>
            Kirim permintaan untuk bergabung ke klan ini. Ketua klan akan
            menyetujui atau menolak permintaan Anda.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
          <AlertDialogAction disabled={loading} onClick={handleSubmit}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Kirim Permintaan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
