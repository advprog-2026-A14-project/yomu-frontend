"use client";

import { FeaturePlaceholder } from "@/src/components/yomu/FeaturePlaceholder";
import { AdminGuard } from "@/src/components/yomu/AdminGuard";

export default function AdminForumPage() {
  return (
    <AdminGuard>
      {() => (
        <FeaturePlaceholder
          eyebrow="Admin Forum"
          title="Moderasi forum dari halaman artikel"
          description="Untuk saat ini, admin dapat meninjau dan menghapus komentar langsung dari forum masing-masing artikel."
          status="Parsial"
          primaryHref="/bacaankuis"
          primaryLabel="Buka daftar artikel"
          notes={[
            "Buka artikel yang ingin ditinjau.",
            "Masuk ke diskusi artikel.",
            "Gunakan aksi hapus pada komentar yang melanggar.",
          ]}
        />
      )}
    </AdminGuard>
  );
}
