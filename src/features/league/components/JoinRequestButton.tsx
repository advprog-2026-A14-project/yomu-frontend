"use client";

import { Button } from "@/src/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { ShieldAlert } from "lucide-react";

export default function JoinRequestButton() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="lg" variant="outline" className="w-full rounded-full border-amber-200 text-amber-800 hover:bg-amber-50 sm:w-auto">
          <ShieldAlert className="size-4" />
          Permintaan bergabung belum dibuka
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Permintaan bergabung belum dibuka</AlertDialogTitle>
          <AlertDialogDescription>
            Untuk saat ini, gunakan fitur gabung langsung dengan kode clan. Persetujuan leader akan hadir pada pembaruan berikutnya.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Mengerti</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
