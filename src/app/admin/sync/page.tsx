"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { FailedSyncEventsPanel } from "@/src/components/admin/FailedSyncEventsPanel";
import { Button } from "@/src/components/ui/button";
import { AdminGuard } from "@/src/components/yomu/AdminGuard";
import { YomuShell } from "@/src/components/yomu/YomuShell";

export default function AdminSyncPage() {
  return (
    <AdminGuard>
      {() => (
        <YomuShell mode="admin">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 md:px-8 lg:px-10">
            <Button asChild variant="outline" className="w-fit rounded-full">
              <Link href="/admin">
                <ArrowLeft className="size-4" />
                Dashboard admin
              </Link>
            </Button>
            <FailedSyncEventsPanel />
          </div>
        </YomuShell>
      )}
    </AdminGuard>
  );
}
