"use client";

import { FeaturePlaceholder } from "@/src/components/yomu/FeaturePlaceholder";
import { AdminGuard } from "@/src/components/yomu/AdminGuard";

export default function AdminAchievementsPage() {
  return (
    <AdminGuard>
      {() => (
        <FeaturePlaceholder
          eyebrow="Admin Achievement"
          title="Pengelolaan achievement segera hadir"
          description="Nanti admin bisa membuat, menyunting, dan mengatur pencapaian yang muncul untuk pelajar."
          status="Segera hadir"
          primaryHref="/admin"
          notes={[
            "Buat pencapaian baru.",
            "Atur syarat dan hadiah badge.",
            "Kelola pencapaian yang tampil di profil pelajar.",
          ]}
        />
      )}
    </AdminGuard>
  );
}
