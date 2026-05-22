"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Shield } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { adminCreateArticle } from "@/src/lib/api/bacaankuis";

type Props = {
  adminName: string;
};

const emptyForm = {
  id: "",
  title: "",
  category: "",
  content: "",
};

export function CatalogAdminActions({ adminName }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateArticle = async () => {
    setError(null);
    setFeedback(null);
    setIsSubmitting(true);

    const response = await adminCreateArticle(form);

    setIsSubmitting(false);

    if (!response.success) {
      setError(response.message);
      return;
    }

    setFeedback("Artikel baru berhasil ditambahkan ke katalog.");
    setForm(emptyForm);
    router.refresh();
    setTimeout(() => {
      setOpen(false);
      setFeedback(null);
    }, 900);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-[1.5rem] border border-emerald-900/10 bg-emerald-50/80 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-emerald-700 p-2 text-white">
          <Shield className="size-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-emerald-950">Mode admin aktif</p>
          <p className="text-xs text-emerald-900/75">Halo, {adminName}. Kamu bisa menambah bacaan langsung dari katalog ini.</p>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="ml-auto rounded-full bg-emerald-700 text-white hover:bg-emerald-800">
            <Plus className="size-4" />
            Tambah Bacaan
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl rounded-[2rem] border-0 bg-[#fffdf8] p-0 shadow-[0_35px_90px_-40px_rgba(60,88,68,0.5)]">
          <div className="grid gap-0 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="border-b border-zinc-200/70 bg-zinc-950 px-7 py-8 text-white lg:border-r lg:border-b-0">
              <DialogHeader className="space-y-3 text-left">
                <DialogTitle className="text-2xl">Tambah bacaan baru</DialogTitle>
                <DialogDescription className="text-sm leading-6 text-zinc-400">
                  Artikel yang kamu buat di sini langsung masuk ke katalog publik `bacaankuis`.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-8 space-y-4 text-sm leading-6 text-zinc-400">
                <p>Pakai kode bacaan yang mudah dikenali, misalnya `art-olahraga-001`.</p>
                <p>Tulis isi bacaan dengan paragraf terpisah agar tampil rapi di ruang baca.</p>
                <p>Kalau artikel sudah tersimpan, kamu bisa langsung buka artikelnya lalu menambahkan banyak soal dari sana.</p>
              </div>
            </div>

            <div className="space-y-4 px-7 py-8">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-900">Kode bacaan</label>
                  <Input
                    placeholder="art-olahraga-001"
                    value={form.id}
                    onChange={(event) => setForm((current) => ({ ...current, id: event.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-900">Kategori</label>
                  <Input
                    placeholder="Olahraga"
                    value={form.category}
                    onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-900">Judul bacaan</label>
                <Input
                  placeholder="Contoh: Mengapa latihan rutin membantu fokus"
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-900">Isi bacaan</label>
                <Textarea
                  rows={12}
                  placeholder="Tulis isi artikel di sini. Pisahkan paragraf dengan satu baris kosong."
                  value={form.content}
                  onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
                />
              </div>

              {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
              {feedback ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{feedback}</p> : null}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" className="rounded-full" onClick={() => setOpen(false)}>
                  Batal
                </Button>
                <Button
                  type="button"
                  className="rounded-full bg-zinc-950 text-white hover:bg-zinc-800"
                  onClick={handleCreateArticle}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Bacaan"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
