"use client";

import { FeaturePlaceholder } from "@/src/components/yomu/FeaturePlaceholder";
import { AdminGuard } from "@/src/components/yomu/AdminGuard";

export default function AdminMissionsPage() {
  return (
    <AdminGuard>
      {() => (
        <FeaturePlaceholder
          eyebrow="Admin Mission"
          title="Pengelolaan misi harian segera hadir"
          description="Nanti admin bisa menyusun misi baca, diskusi, dan kuis harian beserta hadiah yang diterima pelajar."
          status="Segera hadir"
          primaryHref="/admin"
          notes={[
            "Buat misi harian.",
            "Atur progres dan hadiah.",
            "Pantau misi yang sedang berjalan.",
          ]}
        />
      )}
    </AdminGuard>
  );
}
