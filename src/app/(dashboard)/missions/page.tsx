"use client";

import { FeaturePlaceholder } from "@/src/components/yomu/FeaturePlaceholder";
import { LearnerGuard } from "@/src/components/yomu/LearnerGuard";

export default function MissionsPage() {
  return (
    <LearnerGuard>
      {() => (
        <FeaturePlaceholder
          eyebrow="Daily Missions"
          title="Misi harian segera hadir"
          description="Nanti kamu bisa menyelesaikan tantangan baca, diskusi, dan kuis harian untuk menjaga ritme belajar."
          status="Segera hadir"
          primaryHref="/app"
          notes={[
            "Daftar tantangan harian.",
            "Progress pribadi tiap misi.",
            "Hadiah setelah misi selesai.",
          ]}
        />
      )}
    </LearnerGuard>
  );
}
