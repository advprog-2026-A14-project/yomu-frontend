import Link from "next/link";
import { ArrowRight, CalendarClock, Sparkles } from "lucide-react";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  status: string;
  notes: string[];
  primaryHref?: string;
  primaryLabel?: string;
};

export function FeaturePlaceholder({
  eyebrow,
  title,
  description,
  status,
  notes,
  primaryHref = "/app",
  primaryLabel = "Kembali ke dashboard",
}: Props) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#f4f6fb_42%,_#fff7ed_100%)] px-5 py-8 text-zinc-950 md:px-8 lg:px-10">
      <section className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden border-black/5 bg-white/88 shadow-[0_28px_70px_-46px_rgba(30,64,175,0.35)]">
          <div className="bg-[linear-gradient(135deg,_rgba(224,231,255,0.96),_rgba(255,247,237,0.92))] px-6 py-8 md:px-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-indigo-700 text-white">{eyebrow}</Badge>
              <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-800">
                {status}
              </Badge>
            </div>
            <div className="mt-8 max-w-3xl space-y-4">
              <h1 className="text-4xl leading-tight font-semibold text-zinc-950 md:text-5xl">{title}</h1>
              <p className="text-base leading-7 text-zinc-600 md:text-lg">{description}</p>
            </div>
          </div>
          <CardContent className="grid gap-4 p-6 md:grid-cols-2 md:p-8">
            <div className="rounded-[1.5rem] border border-indigo-100 bg-indigo-50 p-5">
              <Sparkles className="size-6 text-indigo-700" />
              <h2 className="mt-4 text-lg font-semibold">Belum dibuka</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Fitur ini sudah punya tempat di Yomu, tetapi belum dibuka untuk penggunaan harian.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-amber-100 bg-amber-50 p-5">
              <CalendarClock className="size-6 text-amber-700" />
              <h2 className="mt-4 text-lg font-semibold">Tetap terarah</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Kamu tetap bisa kembali ke alur utama tanpa menemui tombol yang belum bisa dipakai.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-black/5 bg-zinc-950 text-white shadow-[0_28px_70px_-46px_rgba(24,24,27,0.45)]">
          <CardContent className="space-y-6 p-6 md:p-8">
            <div>
              <p className="text-sm font-medium text-white">Segera hadir</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Ringkasan ini menjelaskan apa yang akan muncul ketika fitur dibuka.
              </p>
            </div>
            <div className="grid gap-3">
              {notes.map((note) => (
                <div key={note} className="rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-zinc-300">
                  {note}
                </div>
              ))}
            </div>
            <Button asChild className="rounded-full bg-white text-zinc-950 hover:bg-zinc-100">
              <Link href={primaryHref}>
                {primaryLabel}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
