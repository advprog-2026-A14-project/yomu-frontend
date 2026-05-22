"use client";

import { FeaturePlaceholder } from "@/src/components/yomu/FeaturePlaceholder";
import { AdminGuard } from "@/src/components/yomu/AdminGuard";

export default function AdminSeasonPage() {
  return (
    <AdminGuard>
      {() => (
        <FeaturePlaceholder
          eyebrow="Admin Liga"
          title="Penutupan musim liga segera hadir"
          description="Nanti admin bisa menutup musim, menyimpan peringkat akhir, dan membuka musim baru dengan lebih terkontrol."
          status="Segera hadir"
          primaryHref="/admin"
          notes={[
            "Ringkasan peringkat akhir musim.",
            "Konfirmasi sebelum musim ditutup.",
            "Persiapan musim baru untuk semua tier.",
          ]}
        />
      )}
    </AdminGuard>
  );
}
