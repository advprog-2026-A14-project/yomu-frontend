"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminBacaanKuisManager } from "@/src/components/bacaankuis/AdminBacaanKuisManager";
import { Button } from "@/src/components/ui/button";
import { AdminGuard } from "@/src/components/yomu/AdminGuard";
import { YomuShell } from "@/src/components/yomu/YomuShell";

export default function AdminArticlesPage() {
  return (
    <AdminGuard>
      {(user) => (
        <YomuShell mode="admin">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 md:px-8 lg:px-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/admin">
                  <ArrowLeft className="size-4" />
                  Dashboard admin
                </Link>
              </Button>
              <Button asChild className="rounded-full bg-zinc-950 text-white hover:bg-zinc-800">
                <Link href="/bacaankuis">Lihat katalog publik</Link>
              </Button>
            </div>
            <AdminBacaanKuisManager adminName={user.display_name} />
          </div>
        </YomuShell>
      )}
    </AdminGuard>
  );
}
