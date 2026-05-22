"use client";

import { FeaturePlaceholder } from "@/src/components/yomu/FeaturePlaceholder";
import { LearnerGuard } from "@/src/components/yomu/LearnerGuard";

export default function AchievementsPage() {
  return (
    <LearnerGuard>
      {() => (
        <FeaturePlaceholder
          eyebrow="Achievements"
          title="Pencapaian belajarmu segera hadir"
          description="Nanti kamu bisa melihat badge yang terkumpul, memilih pencapaian favorit, dan menampilkan progres terbaikmu di profil."
          status="Segera hadir"
          primaryHref="/app"
          notes={[
            "Koleksi badge pribadi.",
            "Pencapaian pilihan untuk profil.",
            "Ringkasan progres membaca dan kuis.",
            "Pengelolaan pencapaian untuk admin.",
          ]}
        />
      )}
    </LearnerGuard>
  );
}
